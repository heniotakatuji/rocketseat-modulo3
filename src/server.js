require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const validate = require('express-validation')
const Youch = require('youch')
const databaseconfig = require('./config/database')
const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.sentry()
    this.middlewares()
    this.routes()
    // excption sem vir depois das rotas
    this.excpetion()
  }

  sentry () {
    Sentry.init(sentryConfig)
  }

  database () {
    mongoose.connect(databaseconfig.uri, {
      useCreateIndex: true
    })
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routers'))
  }

  excpetion () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ erro: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express
