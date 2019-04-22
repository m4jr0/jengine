// dependencies
const game = require('./engine/game/gameserver.js')
const log = require('./engine/log/log.js')
const express = require('express')
const http = require('http')
const path = require('path')
const io = require('socket.io')
const session = require('express-session')
const _ = require('lodash')

// module variables
const nodeConf = require('./config.json')
const defaultConf = nodeConf.dev
const envConfSet = process.env.NODE_ENV || 'dev'
const envConf = nodeConf[envConfSet]
global.conf = _.merge(defaultConf, envConf)

let app = express()
let server = http.Server(app)
let sessionStore = new session.MemoryStore()

let sessionMiddleware = session({
  store: sessionStore,
  secret: global.conf.secretKey,
  name: global.conf.sessionKey,
  resave: true,
  saveUninitialized: true
})

app.use(sessionMiddleware)

app.use('/static', express.static(path.join(__dirname, '/static')))
app.use('/conf', express.static(path.join(__dirname, '/conf')))
app.use('/engine', express.static(path.join(__dirname, '/engine')))

app.use((request, response) => {
  log.Logger.info(`Page loading with session ID: ${request.sessionID}`)
  response.sendFile(path.join(__dirname, '/static/html/index.html'))
})

app.listen()

server.listen(global.conf.port, global.conf.host, () => {
  log.Logger.info(
    `Starting ${global.conf.appName} ` +
    `on http://${global.conf.host}:${global.conf.port}/`
  )
})

const launchGame = async () => {
  try {
    let gameServer = new game.GameServer()

    let isInitialized = await gameServer.initialize({
      socketIO: io.listen(server),
      sessionStore: sessionStore,
      sessionMiddleware: sessionMiddleware
    })

    if (isInitialized) {
      gameServer.start()
    } else {
      log.Logger.error('Cannot start the game')
    }
  } catch (error) {
    log.Logger.error(error)
  }
}

launchGame()
