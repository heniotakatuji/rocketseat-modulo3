const express = require('express')
const mongoose = require('mongoose')
const databaseconfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.middlewares()
    this.routes()
  }

  database () {
    mongoose.connect(databaseconfig.uri, {
      useCreateIndex: true
    })
  }

  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routers'))
  }
}

module.exports = new App().express
