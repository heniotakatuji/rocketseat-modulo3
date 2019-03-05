const nodemailer = require('nodemailer')
const mailConfig = require('../../config/mail')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')

const transport = nodemailer.createTransport(mailConfig)

transport.use(
  'compile',
  hbs({
    viewEngine: exphbs.create({
      partialsDir: path.resolve(
        path.resolve(__dirname, '..', 'views', 'emails'),
        'partials'
      )
    }),
    viewPath: path.resolve(__dirname, '..', 'views', 'emails'),
    extName: '.hbs'
  })
)

module.exports = transport
