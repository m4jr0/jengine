import * as consts from '../toolkit/consts.js'
import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'

export class PhysicsComponent extends gameobject.Component {
  fixedUpdate () {
    if (!this.gameObject_.getComponent('bounding').isCollision) {
      this.isCollision_ = false
      this.handleInputs()
    } else {
      if (this.isCollision_) { // there was a collision on the previous frame
        this.inputVelocity_.x = this.inputVelocity_.y = 0
        this.isCollision_ = false
      } else {
        this.isCollision_ = true
      }
    }

    this.inputVelocity_.x = Math.sign(this.inputVelocity_.x) * Math.min(
      Math.max(Math.abs(this.inputVelocity_.x), 0), this.maxVelocity_.x
    )

    this.inputVelocity_.y = Math.sign(this.inputVelocity_.y) * Math.min(
      Math.max(Math.abs(this.inputVelocity_.y), 0), this.maxVelocity_.y
    )

    this.velocity.x = Math.sign(this.velocity.x) *
      Math.max(Math.abs(this.velocity.x), 0)

    this.velocity.y = Math.sign(this.velocity.x) *
      Math.max(Math.abs(this.velocity.y), 0)

    this.transform_.x +=
      this.velocity.x + this.inputVelocity_.x * this.deltaTime_

    this.transform_.y +=
      this.velocity.y + this.inputVelocity_.y * this.deltaTime_

    const signVelocityX = Math.sign(this.velocity.x)
    const signVelocityY = Math.sign(this.velocity.y)

    const absVelocityX = Math.abs(this.velocity.x)
    const absVelocityY = Math.abs(this.velocity.y)

    if (
      absVelocityX - this.collisionDeceleration_.x <
      this.nullCollisionVelocity_.x
    ) {
      this.velocity.x = 0
    } else {
      this.velocity.x += -1 * signVelocityX * this.collisionDeceleration_.x
    }

    if (
      absVelocityY - this.collisionDeceleration_.y <
      this.nullCollisionVelocity_.y
    ) {
      this.velocity.y = 0
    } else {
      this.velocity.y += -1 * signVelocityY * this.collisionDeceleration_.y
    }
  }

  getCurrentVelocity () {
    return {
      x: this.velocity.x + this.inputVelocity_.x,
      y: this.velocity.y + this.inputVelocity_.y
    }
  }

  handleInputs () {
    const currentInputs = this.input_.getInputs()

    if (Math.abs(this.inputVelocity_.x) <= this.nullVelocity_.x) {
      if (!currentInputs.left && !currentInputs.right) {
        this.direction_.x = 0
        this.inputVelocity_.x = 0
      }
    }

    if (Math.abs(this.inputVelocity_.y) <= this.nullVelocity_.y) {
      if (!currentInputs.up && !currentInputs.down) {
        this.direction_.y = 0
        this.inputVelocity_.y = 0
      }
    }

    if (currentInputs.left) this.direction_.x = -1
    if (currentInputs.right) this.direction_.x = 1
    if (currentInputs.up) this.direction_.y = -1
    if (currentInputs.down) this.direction_.y = 1

    if (!currentInputs.left && !currentInputs.right) {
      this.inputVelocity_.x += this.deceleration_.x * -this.direction_.x
    } else {
      this.inputVelocity_.x += this.acceleration_.x * this.direction_.x
    }

    if (!currentInputs.up && !currentInputs.down) {
      this.inputVelocity_.y += this.deceleration_.y * -this.direction_.y
    } else {
      this.inputVelocity_.y += this.acceleration_.y * this.direction_.y
    }
  }

  initialize (descr) {
    if (!descr) descr = {}

    this.transform_ = this.gameObject_.getComponent('transform')

    if (!this.transform_) {
      throw new Error(
        'You need to add a transform component to the game object first'
      )
    }

    this.input_ = this.gameObject_.getComponent('input')

    if (!this.input_) {
      throw new Error(
        'You need to add an input component to the game object first'
      )
    }

    this.inputVelocity_ = { x: 0.0, y: 0.0 }
    this.velocity = { x: 0.0, y: 0.0 }
    this.direction_ = { x: 1, y: 1 }
    this.maxVelocity_ = descr.maxSpeed || consts.PHYSICS.DEFAULT_MAX_VELOCITY
    this.isCollision_ = false

    this.nullVelocity_ = descr.nullVelocity ||
      consts.PHYSICS.DEFAULT_NULL_VELOCITY

    this.nullCollisionVelocity_ = descr.nullCollisionVelocity ||
        consts.PHYSICS.DEFAULT_NULL_COLLISION_VELOCITY

    this.acceleration_ = descr.acceleration ||
      consts.PHYSICS.DEFAULT_ACCELERATION

    this.deceleration_ = descr.deceleration ||
      consts.PHYSICS.DEFAULT_DECELERATION

    this.collisionDeceleration_ = descr.collisionDeceleration ||
      consts.PHYSICS.DEFAULT_COLLISION_DECELERATION

    this.deltaTime_ = locator.Locator.game.msPerUpdate / 1000
  }

  get name () {
    return 'physics'
  }
}
