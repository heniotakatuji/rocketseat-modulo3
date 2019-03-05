const express = require('express')

const authMiddleware = require('./app/middlewares/auth')

const routes = express.Router()

const controllers = require('./app/controllers')

const validate = require('express-validation')
const validators = require('./app/validators/')
const handle = require('express-async-handler')

routes.post(
  '/users',
  validate(validators.User),
  handle(controllers.UserController.store)
)
routes.post(
  '/session',
  validate(validators.Session),
  handle(controllers.SessionController.store)
)

routes.get('/teste', authMiddleware, (req, res) => res.json({ ok: true }))

routes.use(authMiddleware)
/**
 * Ads apartir das rotas a baixo (routes.use(authMiddleware)), a rotas são privadas
 */
routes.get('/ads', handle(controllers.AdController.index))
routes.get('/ads/:id', handle(controllers.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handle(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handle(controllers.AdController.update)
)
routes.delete('/ads/:id', handle(controllers.AdController.destroy))

/**
 * Purchase
 */
routes.get('/purchases', handle(controllers.PurchaseController.index))
routes.post(
  '/purchases',
  validate(validators.Purchase),
  handle(controllers.PurchaseController.store)
)
routes.put('/purchasesby/:id', handle(controllers.AdController.update))
module.exports = routes
