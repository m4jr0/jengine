import * as consts from '../toolkit/consts.js'
import * as log from '../log/log.js'

export class InputManager {
  static getKeyCode (key) {
    key = key.toLowerCase()

    return key.charCodeAt(0)
  }

  static getChar (keyCode) {
    return String.fromCharCode(keyCode).toLowerCase()
  }

  static getQwertyKeyMap () {
    return {
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right'
    }
  }

  static getAzertyKeyMap () {
    return {
      'z': 'up',
      's': 'down',
      'q': 'left',
      'd': 'right'
    }
  }

  getKeyMap () {
    if (this.keyboardLayout_ === 'qwerty') {
      return InputManager.getQwertyKeyMap()
    } else if (this.keyboardLayout_ === 'azerty') {
      return InputManager.getAzertyKeyMap()
    }

    log.Logger.error(`Unknown keyboard layout: ${this.keyboardLayout_}`)

    return void 0
  }

  update () {}

  fixedUpdate () {}

  initialize (descr) {
    log.Logger.debug('Initializing input manager...')

    if (descr === undefined) descr = {}

    this.keyboardLayout_ = descr.keyboardLayout ||
      consts.INPUT.DEFAULT_KEYBOARD_LAYOUT
  }
}
