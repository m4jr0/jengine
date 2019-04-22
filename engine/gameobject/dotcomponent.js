import * as gameobject from './gameobject.js'
import * as locator from '../locator/locator.js'

export class DotComponent extends gameobject.Component {
  initialize (descr) {
    if (!this.gameObject_.getComponent('transform')) {
      throw new Error(
        'You need to add a transform component to the game object first'
      )
    }

    if (descr === undefined) descr = {}

    this.fillStyle_ = descr.fillStyle || 'red'

    this.size_ = descr.size || 10
    this.context_ = locator.Locator.renderManager.context
    this.transform_ = this.gameObject_.getComponent('transform')
  }

  get name () {
    return 'dot'
  }

  update () {
    this.context_.save()
    this.context_.fillStyle = this.fillStyle_
    this.context_.beginPath()

    this.context_.arc(
      this.transform_.x, this.transform_.y, this.size_, 0, 2 * Math.PI
    )

    this.context_.closePath()
    this.context_.fill()
    this.context_.restore()
  }
}
