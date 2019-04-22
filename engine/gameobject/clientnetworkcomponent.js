import * as consts from '../toolkit/consts.js'
import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'

export class MainClientNetworkComponent extends gameobject.Component {
  reconciliate (data) {
    this.gameObject_.getComponent('input').setMovement(data.inputs)
    this.gameObject_.fixedUpdate()
  }

  updatePlayer (data) {
    this.transform_.position = data.data
  }

  generateSequenceNumber () {
    return this.timeManager_.getRealNow()
  }

  getNetworkMessage () {
    return {
      sequenceNumber: this.generateSequenceNumber(),
      sessionID: this.sessionID_,
      inputs: this.gameObject_.getComponent('input').getInputs()
    }
  }

  initialize (descr) {
    if (!this.gameObject_.getComponent('transform')) {
      throw new Error(
        'You need to add a transform component to the game object first'
      )
    }

    this.sessionID_ = descr.sessionID
    this.transform_ = this.gameObject_.getComponent('transform')
    this.timeManager_ = locator.Locator.timeManager
  }

  get name () {
    return 'mainnetwork'
  }
}

export class ClientNetworkComponent extends gameobject.Component {
  addToBuffer (data) {
    this.bufferArray_.push({
      timestamp: this.timeManager_.getRealNow(),
      data: data
    })
  }

  fixedUpdate () {
    this.interpolate()
  }

  interpolate () {
    const now = this.timeManager_.getRealNow()
    const timestamp = now - (1000 / consts.GAME.DEFAULT_SEND_TO_CLIENT_RATE)

    // droping older server updates
    while (this.bufferArray_.length >= 2 &&
           this.bufferArray_[1].timestamp <= timestamp) {
      this.bufferArray_.shift()
    }

    if (this.bufferArray_.length < 2 ||
        this.bufferArray_[0].timestamp > timestamp ||
        timestamp > this.bufferArray_[1].timestamp) {
      return
    }

    const older = this.bufferArray_[0]
    const newer = this.bufferArray_[1]

    const iX = older.data.data.x +
               (newer.data.data.x - older.data.data.x) *
               (timestamp - older.timestamp) /
               (newer.timestamp - older.timestamp)

    const iY = older.data.data.y +
               (newer.data.data.y - older.data.data.y) *
               (timestamp - older.timestamp) /
               (newer.timestamp - older.timestamp)

    this.transform_.position = { x: iX, y: iY }
  }

  initialize (descr) {
    if (!this.gameObject_.getComponent('transform')) {
      throw new Error(
        'You need to add a transform component to the game object first'
      )
    }

    this.bufferArray_ = []
    this.sessionID_ = descr.sessionID
    this.transform_ = this.gameObject_.getComponent('transform')
    this.timeManager_ = locator.Locator.timeManager
  }

  get name () {
    return 'network'
  }
}
