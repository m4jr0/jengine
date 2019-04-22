import * as consts from '../toolkit/consts.js'
import * as locator from '../locator/locator.js'
import * as log from '../log/log.js'
import * as clientutils from '../toolkit/clientutils.js'

export class RenderManager {
  set width (width) {
    this.canvas_.width = width
  }

  set height (height) {
    this.canvas_.height = height
  }

  get width () {
    return this.canvas_.width
  }

  get height () {
    return this.canvas_.height
  }

  update () {
    this.context.fillStyle = this.backgroundColor_
    this.context.clearRect(0, 0, this.width, this.height)

    locator.Locator.gameObjectManager.update()
  }

  resizeCanvas_ () {
    var viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const currentWidth = this.width
    const currentHeight = this.height
    let newWidth = consts.RENDER.DEFAULT_WIDTH
    let newHeight = consts.RENDER.DEFAULT_HEIGHT

    if (currentHeight / currentWidth > viewport.height / viewport.width) {
      newHeight = viewport.height
      newWidth = newHeight * currentWidth / currentHeight
    } else {
      newWidth = viewport.width
      newHeight = newWidth * currentHeight / currentWidth
    }

    this.width = newWidth
    this.height = newHeight
  }

  async initialize (confFilePath) {
    log.Logger.debug('Initializing render manager...')

    try {
      const confObj = await clientutils.getClientConf(confFilePath)

      if (!confObj.canvas) {
        throw new Error('value \'canvas\' has to be provided')
      }

      this.canvas_ = document.getElementById(confObj['canvas'])
      this.context = this.canvas_.getContext('2d')

      if (confObj.autoResize) {
        this.autoResize = true
      } else {
        if (confObj.width !== undefined) {
          this.setWidth(confObj.width)
        } else {
          this.setWidth(consts.RENDER.DEFAULT_WIDTH)
        }

        if (confObj.height !== undefined) {
          this.setHeight(confObj.height)
        } else {
          this.setHeight(consts.RENDER.DEFAULT_HEIGHT)
        }
      }

      this.resizeCanvas_ = this.resizeCanvas_.bind(this)

      if (this.autoResize) {
        window.addEventListener('resize', this.resizeCanvas_)
        this.resizeCanvas_()
      }

      this.backgroundColor_ = consts.RENDER.DEFAULT_BACKGROUND_COLOR
    } catch (error) {
      log.Logger.error(error)
    }
  }
}
