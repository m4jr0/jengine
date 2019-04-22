import * as consts from '../toolkit/consts.js'
import * as log from '../log/log.js'
import * as serverutils from '../toolkit/serverutils.js'

export class TimeManager {
  get deltaTime () {
    return this.deltaTime_
  }

  update () {
    this.currentTime_ = this.getNow()
    this.deltaTime_ = this.currentTime_ - this.previousTime_
    this.previousTime_ = this.currentTime_
  }

  async initialize (confFilePath) {
    log.Logger.debug('Initializing time manager...')

    try {
      let confObj = {}

      if (confFilePath) confObj = await serverutils.getServerConf(confFilePath)

      this.timeScale_ = confObj.timeScale || consts.TIME.DEFAULT_TIME_SCALE
      this.currentTime_ = 0.0
      this.deltaTime_ = 0.0
      this.previousTime_ = this.getRealNow()

      return true
    } catch (error) {
      log.Logger.error(error)

      return false
    }
  }

  getRealNow () {
    return new Date().getTime()
  }

  getNow () {
    let deltaTime = this.getRealNow() - this.previousTime_
    let timeToAdd = deltaTime * this.timeScale_

    return this.previousTime_ + timeToAdd
  }

  stop () {
    this.timeScale_ = 0.0
  }

  normalize () {
    this.timeScale_ = 1.0
  }
}
