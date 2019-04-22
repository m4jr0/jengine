import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'

export class ServerNetworkComponent extends gameobject.Component {
  get currentSequenceNumber () {
    return this.currentSequenceNumber_
  }

  setCurrentSequenceNumber (sequenceNumber) {
    this.currentSequenceNumber_ = sequenceNumber
  }

  fixedUpdate () {
    if (this.timeManager_.getRealNow() - this.lastTouched_ < this.timeout_) {
      return
    }

    log.Logger.info(
      `Player #${this.playerID_} with session ID ${this.sessionID_} timed out`
    )

    locator.Locator.networkManager.disconnect(this.sessionID_)
  }

  touch () {
    this.lastTouched_ = this.timeManager_.getRealNow()
  }

  updatePlayer (inputs) {
    this.input_.updateMovement(inputs)
    this.touch()
  }

  initialize (descr) {
    this.timeout_ = descr.timeout || global.conf.playerTimeout * 1000
    this.timeManager_ = locator.Locator.timeManager
    this.lastTouched_ = this.timeManager_.getRealNow()
    this.playerID_ = descr.playerID
    this.sessionID_ = descr.sessionID
    this.currentSequenceNumber_ = undefined

    this.input_ = this.gameObject_.getComponent('input')

    if (!this.input_) {
      throw new Error(
        'You need to add an input component to the game object first'
      )
    }
  }

  get name () {
    return 'network'
  }
}
