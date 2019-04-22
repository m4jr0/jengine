import * as gameobject from './gameobject.js'

export class ServerInputComponent extends gameobject.Component {
  getInputs () {
    return this.movementObj_
  }

  updateMovement (inputs) {
    this.movementObj_ = inputs
  }

  initialize (descr) {
    this.movementObj_ = {
      up: false,
      down: false,
      left: false,
      right: false
    }
  }

  get name () {
    return 'input'
  }
}
