export const GAME = {
  DEFAULT_CYCLES_PER_SECOND: 60,
  DEFAULT_SEND_TO_CLIENT_RATE: 60,
  DEFAULT_PHYSICS_RATE: 60,
  DEFAULT_LOG_LEVEL: 'debug',
  DEFAULT_SEND_TO_SERVER_RATE: 60
}

export const INPUT = {
  DEFAULT_KEYBOARD_LAYOUT: 'qwerty'
}

export const NETWORK = {
  DEFAULT_SESSION_INTERVAL: 60
}

export const PHYSICS = {
  DEFAULT_SPAWN_POSITION: { x: 10, y: 10 },
  DEFAULT_MAX_VELOCITY: { x: 300, y: 300 },
  DEFAULT_ACCELERATION: { x: 30, y: 30 },
  DEFAULT_DECELERATION: { x: 20, y: 20 },
  DEFAULT_COLLISION_DECELERATION: { x: 1, y: 1 },
  DEFAULT_NULL_VELOCITY: { x: 19, y: 19 },
  DEFAULT_NULL_COLLISION_VELOCITY: { x: 1, y: 1 },
  DEFAULT_RESPONSE_FACTOR: 3,
  DEFAULT_BOX_COLOR: 'green'
}

export const RENDER = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600,
  DEFAULT_BACKGROUND_COLOR: 'white'
}

export const TIME = {
  DEFAULT_TIME_SCALE: 1.0
}
