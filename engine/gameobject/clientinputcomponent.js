import * as gameobject from './gameobject.js'
import * as input from '../input/input.js'

export class ClientInputComponent extends gameobject.Component {
  getInputs () {
    return this.movementObj_
  }

  setMovement (movement) {
    this.movementObj_ = movement
  }

  addMovement (event) {
    const movement = this.keyMap_[input.InputManager.getChar(event.keyCode)]
    this.movementObj_[movement] = true
  }

  removeMovement (event) {
    const movement = this.keyMap_[input.InputManager.getChar(event.keyCode)]
    this.movementObj_[movement] = false
  }

  resetMovement () {
    this.movementObj_.up = this.movementObj_.down = this.movementObj_.left =
      this.movementObj_.right = false
  }

  initialize (descr) {
    this.movementObj_ = {
      up: false,
      down: false,
      left: false,
      right: false
    }

    this.keyMap_ = descr.keyMap

    document.removeEventListener('keyup', this.removeMovement.bind(this))
    document.addEventListener('keyup', this.removeMovement.bind(this))

    document.removeEventListener('keydown', this.addMovement.bind(this))
    document.addEventListener('keydown', this.addMovement.bind(this))
  }

  get name () {
    return 'input'
  }
}

export class NoInputComponent extends gameobject.Component {
  getInputs () {
    return this.movementObj_
  }

  setMovement (movement) {
    this.movementObj_ = movement
  }

  addMovement (event) {
    const movement = this.keyMap_[input.InputManager.getChar(event.keyCode)]
    this.movementObj_[movement] = true
  }

  removeMovement (event) {
    const movement = this.keyMap_[input.InputManager.getChar(event.keyCode)]
    this.movementObj_[movement] = false
  }

  resetMovement () {
    this.movementObj_.up = this.movementObj_.down = this.movementObj_.left =
      this.movementObj_.right = false
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
