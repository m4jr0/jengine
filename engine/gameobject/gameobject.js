import * as log from '../log/log.js'
import * as commonutils from '../toolkit/commonutils.js'

export class GameObjectManager {
  update () {
    for (let gameObject of this.gameObjectMap_.values()) {
      gameObject.update()
    }
  }

  fixedUpdate () {
    for (let gameObject of this.gameObjectMap_.values()) {
      gameObject.fixedUpdate()
    }
  }

  getGameObjectIDArray () {
    return Array.from(this.gameObjectMap_.keys())
  }

  get gameObjectMap () {
    return this.gameObjectMap_
  }

  addGameObject (gameObject) {
    log.Logger.debug(`Add game object #${gameObject.id}`)
    this.gameObjectMap_.set(gameObject.id, gameObject)
  }

  removeGameObject (gameObjectID) {
    if (gameObjectID === undefined) return
    log.Logger.debug(`Remove game object #${gameObjectID}`)
    this.gameObjectMap_.delete(gameObjectID)
  }

  resetGameObjects () {
    log.Logger.debug(`Reset game objects`)
    this.gameObjectMap_ = new Map()
  }

  getGameObject (gameObjectId) {
    return this.gameObjectMap_.get(gameObjectId) || void 0
  }

  initialize () {
    log.Logger.debug('Initializing game object manager...')

    this.gameObjectMap_ = new Map()
  }
}

export class GameObject {
  update () {
    for (let component of this.componentMap_.values()) {
      if (component.isEnabled) component.update()
    }
  }

  fixedUpdate () {
    for (let component of this.componentMap_.values()) {
      if (component.isEnabled) component.fixedUpdate()
    }

    this.collisionBuff2 = this.collisionBuff1
    this.collisionBuff1 = new Map()
  }

  get componentMap () {
    return this.componentMap_
  }

  addComponent (component) {
    this.componentMap_.set(component.name, component)
  }

  removeComponent (component) {
    this.componentMap_.delete(component.name)
  }

  getComponent (componentName) {
    return this.componentMap_.get(componentName) || void 0
  }

  onCollision (descr) {
    this.collisionBuff1.set(descr.with.gameObject.id, true)

    for (let component of this.componentMap_.values()) {
      if (component.isEnabled) component.onCollision(descr)
    }
  }

  initialize (descr) {}

  constructor (descr) {
    if (!descr) descr = {}

    this.componentMap_ = new Map()
    this.id = descr.id || commonutils.id()
    this.collisionBuff1 = new Map()
    this.collisionBuff2 = new Map()

    this.initialize(descr)
  }
}

export class Component {
  get isEnabled () {
    return this.isEnabled_
  }

  update () {}

  fixedUpdate () {}

  disable () {
    this.isEnabled_ = false
  }

  enable () {
    this.isEnabled_ = true
  }

  get gameObject () {
    return this.gameObject_
  }

  onCollision (descr) {}

  name () {
    return 'generic'
  }

  initialize (descr) {}

  constructor (gameObject, descr) {
    this.gameObject_ = gameObject
    this.isEnabled_ = true
    this.initialize(descr)
  }
}
