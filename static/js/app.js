/* global io */

import * as log from '/engine/log/log.js'
import * as game from '/engine/game/gameclient.js'

document.addEventListener('DOMContentLoaded', () => {
  const launchGame = async () => {
    try {
      let gameClient = new game.GameClient()

      let isInitialized = await gameClient.initialize({
        socketIO: io()
      })

      if (isInitialized) {
        gameClient.start()
      } else {
        log.Logger.error('Cannot start the game')
      }
    } catch (error) {
      log.Logger.error(error)
    }
  }

  launchGame()
})
