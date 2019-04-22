import * as factory from '../gameobject/factory.js'
import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'

export class ClientNetworkManager {
  update () {
    const player = locator.Locator.gameObjectManager_.player

    if (player === undefined) {
      log.Logger.warning('There is no game object associated to the player')
      return
    }

    const messageToSend = player.getComponent('mainnetwork').getNetworkMessage()

    this.socketIO_.emit('receive', messageToSend)
    this.pendingInputArray_.push(messageToSend)
  }

  connect (data) {
    this.playerID_ = data.playerID
    this.sessionID_ = data.sessionID

    log.Logger.info(
      `Player #${this.playerID_} connected with session ID ${this.sessionID_}`
    )
  }

  applyServerReconciliation (gameObject, data) {
    let index = 0

    while (index < this.pendingInputArray_.length) {
      const input = this.pendingInputArray_[index]

      if (input.sequenceNumber <= data.sequenceNumber) {
        // already processed input, we can drop it
        this.pendingInputArray_.splice(index, 1)
      } else {
        gameObject.getComponent('mainnetwork').reconciliate(input)
        ++index
      }
    }
  }

  applyPlayerInterpolation (gameObject, data) {
    gameObject.getComponent('network').addToBuffer(data)
  }

  addGameObject (playerID, gameObjectDescr) {
    let gameObject

    if (playerID !== this.playerID_) {
      gameObject = factory.PlayerFactory.createClientOther(
        playerID, gameObjectDescr, playerID
      )
    } else {
      gameObject = factory.PlayerFactory.createClientMain(
        playerID, gameObjectDescr, this.sessionID_
      )

      locator.Locator.gameObjectManager_.player = gameObject
    }

    locator.Locator.gameObjectManager.addGameObject(gameObject)

    return gameObject
  }

  receive (data) {
    let gameObjectManager = locator.Locator.gameObjectManager
    let processedPlayers = []

    for (const playerID in data) {
      if (!data.hasOwnProperty(playerID)) continue

      let playerObj = gameObjectManager.getGameObject(playerID)

      if (playerObj === void 0) {
        playerObj = this.addGameObject(playerID, data[playerID])
      }

      if (playerID === this.playerID_) {
        playerObj.getComponent('mainnetwork').updatePlayer(data[playerID])
        this.applyServerReconciliation(playerObj, data[playerID])
      } else {
        this.applyPlayerInterpolation(playerObj, data[playerID])
      }

      processedPlayers.push(playerID)
    }

    let playerIDArray = gameObjectManager.getGameObjectIDArray()

    for (const playerID of playerIDArray) {
      if (processedPlayers.includes(playerID) ||
          gameObjectManager.getGameObject(playerID)
            .getComponent('network') === undefined) {
        continue
      }

      gameObjectManager.removeGameObject(playerID)
    }
  }

  initialize (descr) {
    log.Logger.info('Initializing network manager...')

    this.playerID_ = undefined
    this.sessionID_ = undefined
    this.pendingInputArray_ = []

    this.socketIO_ = descr.socketIO
    this.socketIO_.on('onconnected', this.connect.bind(this))
    this.socketIO_.on('update', this.receive.bind(this))

    return true
  }
}
