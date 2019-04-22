import * as gameobject from './gameobject.js'

export class TransformComponent extends gameobject.Component {
  set x (x) {
    this.position.x = x
  }

  set y (y) {
    this.position.y = y
  }

  get x () {
    return this.position.x
  }

  get y () {
    return this.position.y
  }

  initialize (descr) {
    if (descr.position) this.position = descr.position
    else if (descr.x && descr.y) this.position = { x: descr.x, y: descr.y }
    else this.position = { x: 0, y: 0 }

    return true
  }

  get name () {
    return 'transform'
  }
}
