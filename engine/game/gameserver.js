import * as consts from '../toolkit/consts.js'
import * as factory from '../gameobject/factory.js'
import * as gameobject from '../gameobject/gameobject.js'
import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'
import * as network from '../network/servernetwork.js'
import * as physics from '../physics/physics.js'
import * as time from '../time/servertime.js'

export class GameServer {
  get isRunning () {
    return this.isRunning_
  }

  set cyclesPerSecond (cyclesPerSecond) {
    this.cyclesPerSecond_ = cyclesPerSecond
    this.msPerUpdate_ = Math.floor(1 / this.cyclesPerSecond_ * 1000 * 100) / 100
  }

  get cyclesPerSecond () {
    return this.cyclesPerSecond_
  }

  get msPerUpdate () {
    return this.msPerUpdate_
  }

  set sendRate (sendRate) {
    this.sendRate_ = sendRate
    this.msPerRefresh_ = Math.floor(1 / this.sendRate_ * 1000 * 100) / 100
  }

  get type () {
    return 'server'
  }

  get sendRate () {
    return this.sendRate_
  }

  get descr () {
    return {
      lag: this.lag_,
      isRunning: this.isRunning_,
      msPerUpdate: this.msPerUpdate_,
      cyclesPerSecond: this.cyclesPerSecond_,
      msPerRefresh: this.msPerRefresh_,
      sendRate: this.sendRate_,
      physicsUpdates: this.physicsUpdates_,
      networkUpdates: this.networkUpdates_
    }
  }

  get json () {
    return JSON.stringify(this.descr)
  }

  async initialize (descr) {
    log.Logger.info('Initializing game server...')

    try {
      this.cyclesPerSecond =
        descr.cyclesPerSecond || consts.GAME.DEFAULT_CYCLES_PER_SECOND

      this.sendRate = descr.sendRate || consts.GAME.DEFAULT_SEND_TO_CLIENT_RATE

      this.lag_ = 0.0
      this.isRunning_ = false
      this.previousUpdateTime_ = 0.0
      this.physicsUpdates_ = 0
      this.networkUpdates_ = 0
      this.previousCycleTime_ = 0.0
      this.networkInterval_ = void 0

      this.timeManager_ = new time.TimeManager()
      this.physicsManager_ = new physics.PhysicsManager()
      this.gameObjectManager_ = new gameobject.GameObjectManager()
      this.networkManager_ = new network.ServerNetworkManager()

      locator.Locator.initialize(this)
      locator.Locator.timeManager = this.timeManager_
      locator.Locator.physicsManager = this.physicsManager_
      locator.Locator.gameObjectManager = this.gameObjectManager_
      locator.Locator.networkManager = this.networkManager_

      this.physicsManager_.initialize()
      this.gameObjectManager_.initialize()

      this.networkManager_.initialize(descr)

      let isInitialized = await this.timeManager_.initialize()

      return isInitialized
    } catch (error) {
      log.Logger.error(error)

      return false
    }
  }

  setUpLevel () {
    this.gameObjectManager_.resetGameObjects()
    this.gameObjectManager_.addGameObject(factory.LevelFactory.create())
  }

  start () {
    log.Logger.debug('Game server will now start')
    this.setUpLevel()
    this.isRunning_ = true
    this.lag_ = 0.0
    this.previousUpdateTime_ = this.timeManager_.getRealNow()

    this.networkInterval_ = setInterval(
      this.updateClients.bind(this), this.msPerRefresh_
    )

    this.loop()
  }

  stop () {
    log.Logger.debug('Game server will now stop')
    clearInterval(this.networkInterval_)
    this.networkInterval_ = void 0
    this.isRunning_ = false
  }

  updateClients () {
    if (this.timeManager_.getRealNow() - this.previousUpdateTime_ > 1000) {
      log.Logger.debug(`Clients got updated ${this.networkUpdates_} times`)
      this.networkUpdates_ = 0
      this.previousUpdateTime_ = this.timeManager_.getRealNow()
    }

    this.networkManager_.update()
    ++this.networkUpdates_
  }

  loop () {
    if (!this.isRunning_) return

    this.timeManager_.update()
    let deltaTime = this.timeManager_.deltaTime

    this.lag_ += deltaTime
    this.previousCycleTime_ += deltaTime

    if (this.previousCycleTime_ > 1000) {
      log.Logger.debug(`Physics got updated ${this.physicsUpdates_} times`)
      this.previousCycleTime_ = 0.0
      this.physicsUpdates_ = 0
    }

    while (this.lag_ >= this.msPerUpdate_) {
      this.physicsManager_.update()
      this.lag_ -= this.msPerUpdate_
      ++this.physicsUpdates_
    }

    setTimeout(this.loop.bind(this), 1)
  }
}
