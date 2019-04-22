import * as consts from '../toolkit/consts.js'
import * as factory from '../gameobject/factory.js'
import * as gameobject from '../gameobject/gameobject.js'
import * as input from '../input/input.js'
import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'
import * as network from '../network/clientnetwork.js'
import * as physics from '../physics/physics.js'
import * as render from '../render/render.js'
import * as time from '../time/clienttime.js'

export class GameClient {
  get isRunning () {
    return this.isRunning_
  }

  set sendRate (sendRate) {
    this.sendRate_ = sendRate
    this.msPerUpdate_ = Math.floor(1 / this.sendRate_ * 1000 * 100) / 100
  }

  get msPerUpdate () {
    return this.msPerUpdate_
  }

  get sendRate () {
    return this.sendRate_
  }

  get type () {
    return 'client'
  }

  set physicsRate (physicsRate) {
    this.physicsRate_ = physicsRate
    this.msPerCycle_ = Math.floor(1 / this.physicsRate_ * 1000 * 100) / 100
  }

  get msPerCycle () {
    return this.msPerCycle_
  }

  get physicsRate () {
    return this.physicsRate_
  }

  get descr () {
    return {
      lag: this.lag_,
      isRunning: this.isRunning_,
      msPerCycle: this.msPerCycle_,
      msPerUpdate: this.msPerUpdate_,
      sendRate: this.sendRate_,
      physicsRate: this.physicsRate_,
      renderUpdates: this.renderUpdates_,
      physicsUpdates: this.physicsUpdates_,
      networkUpdates: this.networkUpdates_
    }
  }

  get json () {
    return JSON.stringify(this.descr)
  }

  async initialize (descr) {
    log.Logger.info('Initializing game client...')

    try {
      this.cyclesPerSecond =
        descr.cyclesPerSecond || consts.GAME.DEFAULT_CYCLES_PER_SECOND

      this.sendRate = descr.sendRate || consts.GAME.DEFAULT_SEND_TO_SERVER_RATE

      this.physicsRate =
        descr.physicsRate || consts.GAME.DEFAULT_CYCLES_PER_SECOND

      this.lag_ = 0.0
      this.isRunning_ = false
      this.previousUpdateTime_ = 0.0
      this.renderUpdates_ = 0
      this.physicsUpdates_ = 0
      this.networkUpdates_ = 0
      this.previousRenderTime_ = 0.0
      this.previousCycleTime_ = 0.0
      this.networkInterval_ = void 0

      this.timeManager_ = new time.TimeManager(
        descr.timeManagerConfPath || consts.GAME.DEFAULT_TIME_MANAGER_CONF_PATH
      )

      this.renderManager_ = new render.RenderManager()
      this.physicsManager_ = new physics.PhysicsManager()
      this.gameObjectManager_ = new gameobject.GameObjectManager()
      this.networkManager_ = new network.ClientNetworkManager()
      this.inputManager_ = new input.InputManager()

      locator.Locator.initialize(this)
      locator.Locator.timeManager = this.timeManager_
      locator.Locator.renderManager = this.renderManager_
      locator.Locator.physicsManager = this.physicsManager_
      locator.Locator.gameObjectManager = this.gameObjectManager_
      locator.Locator.networkManager = this.networkManager_
      locator.Locator.inputManager = this.inputManager_

      this.gameObjectManager_.initialize()
      this.networkManager_.initialize(descr)
      this.inputManager_.initialize()

      const isRenderManager =
        this.renderManager_.initialize('/conf/rendermanager.conf')

      const isTimeManager = this.timeManager_.initialize()

      const resultArray = [await isRenderManager, isTimeManager]

      return !resultArray.includes(false)
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
      this.updateClient.bind(this), this.msPerUpdate_
    )

    this.loop()
  }

  stop () {
    log.Logger.debug('Game server will now stop')
    clearInterval(this.networkInterval_)
    this.networkInterval_ = void 0
    this.isRunning_ = false
  }

  updateClient () {
    if (this.timeManager_.getRealNow() - this.previousUpdateTime_ > 1000) {
      log.Logger.debug(`Client got updated ${this.networkUpdates_} times`)
      this.networkUpdates_ = 0
      this.previousUpdateTime_ = this.timeManager_.getRealNow()
    }

    this.networkManager_.update(this.lag_ / this.msPerCycle_)
    ++this.networkUpdates_
  }

  loop () {
    if (!this.isRunning_) return

    this.timeManager_.update()
    let deltaTime = this.timeManager_.deltaTime

    this.lag_ += deltaTime
    this.previousRenderTime_ += deltaTime

    if (this.previousCycleTime_ > 1000) {
      log.Logger.debug(`Physics got updated ${this.physicsUpdates_} times`)
      this.previousCycleTime_ = 0.0
      this.physicsUpdates_ = 0
    }

    while (this.lag_ >= this.msPerCycle_) {
      this.physicsManager_.update()
      this.lag_ -= this.msPerCycle_
      ++this.physicsUpdates_
    }

    if (this.previousRenderTime_ > 1000) {
      log.Logger.debug(`Render got updated ${this.renderUpdates_} times`)
      this.previousRenderTime_ = 0.0
      this.renderUpdates_ = 0
    }

    this.renderManager_.update()
    ++this.renderUpdates_

    setTimeout(this.loop.bind(this), 1)
  }
}
