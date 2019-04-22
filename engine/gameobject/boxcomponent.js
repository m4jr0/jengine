import * as consts from '../toolkit/consts.js'
import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'

export class BoxComponent extends gameobject.Component {
  initialize (descr) {
    if (descr.isDisplayed === undefined) descr.isDisplayed = false

    this.left_ = descr.from.x
    this.right_ = descr.to.x
    this.top_ = descr.from.y
    this.bottom_ = descr.to.y

    this.collisionFunctionObj_ = {}
    this.generateCollisionObj()

    this.isClient_ = locator.Locator.game.type === 'client'

    if (this.isClient_) {
      this.isDisplayed_ = descr.isDisplayed
      this.fillStyle_ = descr.fillStyle || consts.PHYSICS.DEFAULT_BOX_COLOR
      this.isCollision = false
      this.context_ = locator.Locator.renderManager.context
    }
  }

  get name () {
    return 'box'
  }

  fixedUpdate () {
    this.handleCollisions()
  }

  update () {
    if (!this.isDisplayed_ && !this.isClient_) return

    this.draw()
  }

  handleCollisions () {
    this.isCollision = false
    let gameObjectMap = locator.Locator.gameObjectManager.gameObjectMap

    for (let gameObject of gameObjectMap.values()) {
      if (gameObject === this.gameObject_) continue

      for (let component of gameObject.componentMap.values()) {
        if (component.isEnabled && component.name !== 'bounding') continue

        let transform = component.gameObject.getComponent('transform')

        if (transform === undefined) continue

        this.keepItContained(component, transform)
      }
    }
  }

  keepItContained (component, transform) {
    const collisionFunction =
      this.collisionFunctionObj_[component.type]

    return collisionFunction(component, transform)
  }

  draw () {
    this.context_.save()
    this.context_.globalAlpha = 0.2
    this.context_.fillStyle = this.fillStyle_
    this.context_.beginPath()

    this.context_.rect(this.left_, this.top_, this.right_, this.bottom_)

    this.context_.closePath()
    this.context_.fill()
    this.context_.restore()
  }

  keepCircleContained (component, transform) {
    const bounds = component.getBounds()

    if (bounds.right > this.right_) {
      transform.x = this.right_ - component.radius
    }

    if (bounds.left < this.left_) {
      transform.x = this.left_ + component.radius
    }

    if (bounds.top < this.top_) {
      transform.y = this.top_ + component.radius
    }

    if (bounds.bottom > this.bottom_) {
      transform.y = this.bottom_ - component.radius
    }
  }

  generateCollisionObj () {
    this.collisionFunctionObj_ = {
      circle: this.keepCircleContained.bind(this)
    }
  }
}
