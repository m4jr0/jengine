import * as consts from '../toolkit/consts.js'
import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'

export class BodyComponent extends gameobject.Component {
  get name () {
    return 'body'
  }

  onCollision (descr) {
    const other = descr.with

    let physics1 = this.gameObject.getComponent('physics')
    let physics2 = other.gameObject.getComponent('physics')

    let currentVelocity1 = physics1.getCurrentVelocity()
    let currentVelocity2 = physics2.getCurrentVelocity()

    currentVelocity1 = {
      x: currentVelocity1.x * this.deltaTime_ * this.responseFactor_,
      y: currentVelocity1.y * this.deltaTime_ * this.responseFactor_
    }

    currentVelocity2 = {
      x: currentVelocity2.x * this.deltaTime_ * this.responseFactor_,
      y: currentVelocity2.y * this.deltaTime_ * this.responseFactor_
    }

    physics1.velocity.x = currentVelocity2.x || 1
    physics1.velocity.y = currentVelocity2.y || 1

    physics2.velocity.x = currentVelocity1.x || 1
    physics2.velocity.y = currentVelocity1.y || 1

    // if (!this.gameObject.collisionBuff2.get(other.gameObject.id)) return

    let transform1 = this.gameObject.getComponent('transform')
    let transform2 = other.gameObject.getComponent('transform')

    const dX = transform1.x - transform2.x
    const dY = transform1.y - transform2.y

    physics1.velocity.x = Math.sign(dX) * Math.abs(physics1.velocity.x)
    physics1.velocity.y = -Math.sign(dY) * Math.abs(physics1.velocity.y)

    physics2.velocity.x = -Math.sign(dX) * Math.abs(physics2.velocity.x)
    physics2.velocity.y = Math.sign(dY) * Math.abs(physics2.velocity.y)
  }

  initialize (descr) {
    if (!descr) descr = {}

    this.deltaTime_ = locator.Locator.game.msPerUpdate / 1000

    this.responseFactor_ = descr.responseFactor ||
      consts.PHYSICS.DEFAULT_RESPONSE_FACTOR
  }
}
