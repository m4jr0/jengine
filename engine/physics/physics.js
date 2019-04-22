import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'

export class PhysicsManager {
  get counter () {
    return this.counter_
  }

  update () {
    locator.Locator.gameObjectManager.fixedUpdate()
  }

  initialize (confFilePath) {
    log.Logger.debug('Initializing physics manager...')

    return true
  }
}
