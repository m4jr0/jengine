import * as cookie from 'cookie'
import * as session from 'express-session'
import { v1 as uuidv1 } from 'uuid'

import * as consts from '../toolkit/consts.js'
import * as factory from '../gameobject/factory.js'
import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'

export class ServerNetworkManager {
  update () {
    const gameObjectMap = locator.Locator.gameObjectManager_.gameObjectMap
    let players = {}

    for (const [playerID, gameObject] of gameObjectMap.entries()) {
      if (gameObject.getComponent('network') === undefined) continue

      players[playerID] = {
        playerID: playerID,
        data: gameObject.getComponent('transform').position,
        sequenceNumber: gameObject.getComponent('network').currentSequenceNumber
      }
    }

    this.socketIO_.emit('update', players)
  }

  receive (id, data) {
    const playerID = this.clientIDMap_.get(data.sessionID)
    const inputs = data.inputs
    let player = locator.Locator.gameObjectManager.getGameObject(playerID)

    if (player === undefined) return

    let networkComp = player.getComponent('network')
    networkComp.updatePlayer(inputs)
    networkComp.setCurrentSequenceNumber(data.sequenceNumber)
  }

  authorizationMiddleware (data, accept) {
    if (data.headers.cookie) {
      data.cookie = cookie.parse(data.headers.cookie)

      data.sessionID = data.cookie[global.conf.sessionKey]
        .split('.')[0].split(':')[1]

      data.sessionStore = this.sessionStore_

      this.sessionStore_.get(data.sessionID, (error, sessionObj) => {
        if (error || !sessionObj) {
          let errorMessage = 'Unknown error'

          if (error) errorMessage = error
          else if (!sessionObj) errorMessage = 'Undefined session'

          log.Logger.error(errorMessage)
          accept(errorMessage, false)
        } else {
          log.Logger.debug(`Session: ${data.sessionID}`)
          data.session = new session.Session(data, sessionObj)
          accept(null, true)
        }
      })
    } else {
      return accept('No cookie transmitted', false)
    }
  }

  disconnect (sessionID) {
    const playerID = this.clientIDMap_.get(sessionID)
    locator.Locator.gameObjectManager.removeGameObject(playerID)
    this.clientIDMap_.delete(sessionID)
    this.sessionStore_.destroy(sessionID, (error, data) => {
      if (error) {
        let errorMessage = 'Unknown error'

        if (error) errorMessage = error

        log.Logger.error(errorMessage)
      } else {
        log.Logger.debug(`Session destroyed: ${sessionID}`)
      }
    })

    log.Logger.info(`Player #${playerID} with session ID ${sessionID} left`)
  }

  accept (socket) {
    let sessionObj = socket.request.session
    let gameObjectManager = locator.Locator.gameObjectManager
    const playerID = uuidv1()
    const sessionID = sessionObj.id

    log.Logger.info(`Socket with session ID ${sessionID} connected!`)

    if (this.clientIDMap_.has(sessionID)) {
      log.Logger.info(
        `Session ID ${sessionID} is already bound to a game object. \
        Destroying the old one...`
      )

      locator.Locator.gameObjectManager.removeGameObject(
        this.clientIDMap_.get(sessionID)
      )

      this.clientIDMap_.delete(sessionID)
    }

    log.Logger.info(`Session ID ${sessionID} is now bound to ${playerID}`)
    this.clientIDMap_.set(sessionID, playerID)
    socket.emit('onconnected', { sessionID: sessionID, playerID: playerID })

    gameObjectManager.addGameObject(
      factory.PlayerFactory.createServerPlayer(
        sessionID, playerID, this.spawnPosition_
      )
    )

    socket.on('disconnect', () => {
      log.Logger.info(
        `Socket with session ID ${sessionID} disconnected`
      )

      this.disconnect(sessionID)
    })

    socket.on('receive', (data) => {
      this.receive(socket.id, data)
    })
  }

  initialize (descr) {
    log.Logger.info('Initializing network manager...')

    this.socketIO_ = descr.socketIO
    this.sessionStore_ = descr.sessionStore
    this.clientIDMap_ = new Map()

    this.sessionInterval_ =
      descr.sessionInterval || consts.NETWORK.DEFAULT_SESSION_INTERVAL

    this.spawnPosition_ =
      descr.spawnPosition || consts.PHYSICS.DEFAULT_SPAWN_POSITION

    this.socketIO_.set('authorization', this.authorizationMiddleware.bind(this))

    this.socketIO_.use((socket, next) => {
      descr.sessionMiddleware(socket.request, socket.request.res, next)
    })

    this.socketIO_.sockets.on('connection', this.accept.bind(this))

    return true
  }
}
