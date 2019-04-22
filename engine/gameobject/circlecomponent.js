import * as consts from '../toolkit/consts.js'
import * as gameobject from './boundingcomponent.js'
import * as locator from '../locator/locator.js'
import * as collision from '../physics/collision.js'

export class CircleComponent extends gameobject.BoundingComponent {
  initialize (descr) {
    if (!descr) descr = {}

    super.initialize(descr)

    this.radius_ = descr.radius || 10
    this.isClient_ = locator.Locator.game.type === 'client'

    if (this.isClient_) {
      this.context_ = locator.Locator.renderManager.context
      this.fillStyle_ = descr.fillStyle || consts.PHYSICS.DEFAULT_BOX_COLOR
    }
  }

  getBounds () {
    return {
      top: this.transform_.y - this.radius_,
      right: this.transform_.x + this.radius_,
      bottom: this.transform_.y + this.radius_,
      left: this.transform_.x - this.radius_
    }
  }

  get center () {
    return this.transform_
  }

  get radius () {
    return this.radius_
  }

  get type () {
    return 'circle'
  }

  draw () {
    if (!this.isClient_) return

    this.context_.save()
    this.context_.fillStyle = this.fillStyle_
    this.context_.beginPath()

    this.context_.arc(
      this.transform._x, this.transform._y, this.radius_, 0, 2 * Math.PI
    )

    this.context_.closePath()
    this.context_.fill()
    this.context_.restore()
  }

  generateCollisionObj () {
    this.collisionFunctionObj_ = {
      circlecircle: collision.circleVSCircle,
      circleaabb: collision.circleVSAABB,
      circleobb: collision.circleVSOBB,
      circlekdop: collision.circleVSKDop,
      circlepoint: collision.circleVSPoint,
      circleedge: collision.circleVSEdge,
      aabbcircle: collision.AABBVSCircle,
      obbcircle: collision.OBBVSCircle,
      kdopcircle: collision.KDopVSCircle,
      pointcircle: collision.pointVSCircle,
      edgecircle: collision.edgeVSCircle
    }
  }
}
