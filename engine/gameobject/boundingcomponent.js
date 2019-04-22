import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'

export class BoundingComponent extends gameobject.Component {
  initialize (descr) {
    if (!this.gameObject_.getComponent('transform')) {
      throw new Error(
        'You need to add a transform component to the game object first'
      )
    }

    if (descr.isDisplayed === undefined) descr.isDisplayed = false

    this.isDisplayed_ = descr.isDisplayed
    this.isCollision = false
    this.transform_ = this.gameObject_.getComponent('transform')
    this.collisionFunctionObj_ = {}
    this.generateCollisionObj()
  }

  getBounds () {
    return {
      top: this.transform_.y,
      right: this.transform_.x,
      bottom: this.transform_.y,
      left: this.transform_.x
    }
  }

  get name () {
    return 'bounding'
  }

  fixedUpdate () {
    this.handleCollisions()
  }

  update () {
    if (!this.isDisplayed_) return

    this.draw()
  }

  handleCollisions () {
    this.isCollision = false
    let gameObjectMap = locator.Locator.gameObjectManager.gameObjectMap

    for (let gameObject of gameObjectMap.values()) {
      if (gameObject === this.gameObject_) continue

      for (let component of gameObject.componentMap.values()) {
        if (component.isEnabled && component.name !== 'bounding') continue

        if (!this.isCollisionDetected(component)) {
          continue
        }

        component.isCollision = true
        this.isCollision = true

        this.gameObject_.onCollision({
          from: this,
          with: component
        })
      }
    }
  }

  isCollisionDetected (component) {
    const collisionFunction =
      this.collisionFunctionObj_[`${this.type}${component.type}`]

    return collisionFunction(this, component)
  }

  draw () {} // to be implemented in the child classes

  generateCollisionObj () {} // to be implemented in the child classes
}
