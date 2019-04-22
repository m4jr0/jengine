import * as bodycomp from './bodycomponent.js'
import * as boxcomp from './boxcomponent.js'
import * as circlecomp from './circlecomponent.js'
import * as clientinputcomp from './clientinputcomponent.js'
import * as clientnetworkcomp from './clientnetworkcomponent.js'
import * as dotcomp from './dotcomponent.js'
import * as locator from '../locator/locator.js'
import * as gameobject from './gameobject.js'
import * as physicscomp from './physicscomponent.js'
import * as serverinputcomp from './serverinputcomponent.js'
import * as servernetworkcomp from './servernetworkcomponent.js'
import * as transformcomp from './transformcomponent.js'

export class LevelFactory {
  static create () {
    let level = new gameobject.GameObject()

    let box = new boxcomp.BoxComponent(
      level,
      {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 1000,
          y: 1000
        }
      }
    )

    level.addComponent(box)

    return level
  }
}

export class PlayerFactory {
  static createServerPlayer (sessionID, playerID, position) {
    let player = new gameobject.GameObject({ id: playerID })

    let transform = new transformcomp.TransformComponent(player, position)
    player.addComponent(transform)

    let input = new serverinputcomp.ServerInputComponent(player, position)
    player.addComponent(input)

    let physics = new physicscomp.PhysicsComponent(player, position)
    player.addComponent(physics)

    let network = new servernetworkcomp.ServerNetworkComponent(player, {
      sessionID: sessionID,
      playerID: playerID
    })

    player.addComponent(network)

    let circle = new circlecomp.CircleComponent(player)
    player.addComponent(circle)

    let body = new bodycomp.BodyComponent(player)
    player.addComponent(body)

    return player
  }

  static createClientMain (id, position, sessionID) {
    let player = new gameobject.GameObject({ id: id })

    let transform = new transformcomp.TransformComponent(player, position)
    player.addComponent(transform)

    let dot = new dotcomp.DotComponent(player, { fillStyle: 'black' })
    player.addComponent(dot)

    let input = new clientinputcomp.ClientInputComponent(player, {
      keyMap: locator.Locator.inputManager.getKeyMap()
    })

    player.addComponent(input)

    let physics = new physicscomp.PhysicsComponent(player)
    player.addComponent(physics)

    let network = new clientnetworkcomp.MainClientNetworkComponent(player, {
      sessionID: sessionID
    })

    player.addComponent(network)

    let circle = new circlecomp.CircleComponent(player)
    player.addComponent(circle)

    let body = new bodycomp.BodyComponent(player)
    player.addComponent(body)

    return player
  }

  static createClientOther (id, position, sessionID) {
    let player = new gameobject.GameObject({ id: id })

    let transform = new transformcomp.TransformComponent(player, position)
    player.addComponent(transform)

    let dot = new dotcomp.DotComponent(player)
    player.addComponent(dot)

    let input = new clientinputcomp.NoInputComponent(player)
    player.addComponent(input)

    let network = new clientnetworkcomp.ClientNetworkComponent(player, {
      sessionID: sessionID
    })

    player.addComponent(network)

    let physics = new physicscomp.PhysicsComponent(player, position)
    player.addComponent(physics)

    let circle = new circlecomp.CircleComponent(player)
    player.addComponent(circle)

    let body = new bodycomp.BodyComponent(player)
    player.addComponent(body)

    return player
  }
}
