import * as log from '../log/log.js'

export class Locator {
  static initialize (game) {
    log.Logger.debug('Initializing locator...')

    this.game = game

    return true
  }

  static set game (game) {
    this.game_ = game
  }

  static set timeManager (timeManager) {
    this.timeManager_ = timeManager
  }

  static set physicsManager (physicsManager) {
    this.physicsManager_ = physicsManager
  }

  static set renderManager (renderManager) {
    this.renderManager_ = renderManager
  }

  static set gameObjectManager (gameObjectManager) {
    this.gameObjectManager_ = gameObjectManager
  }

  static set networkManager (networkManager) {
    this.networkManager_ = networkManager
  }

  static get game () {
    return this.hasOwnProperty('game_') ? this.game_ : void 0
  }

  static get timeManager () {
    return this.hasOwnProperty('timeManager_') ? this.timeManager_ : void 0
  }

  static get physicsManager () {
    return this.hasOwnProperty('physicsManager_')
      ? this.physicsManager_ : void 0
  }

  static get renderManager () {
    return this.hasOwnProperty('renderManager_') ? this.renderManager_ : void 0
  }

  static get gameObjectManager () {
    return this.hasOwnProperty('gameObjectManager_')
      ? this.gameObjectManager_ : void 0
  }

  static get networkManager () {
    return this.hasOwnProperty('networkManager_')
      ? this.networkManager_ : void 0
  }
}
