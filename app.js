require('dotenv').config()
const express = require('express')
const app = express()
const path = require('node:path')
const session = require('express-session')
const passport = require('./authentication/passport')
const CustomError = require('./errors/CustomError')

const homeRouter = require('./routes/homeRouter')

// Will need to install and use method-override to use DELETE, PUT and PATCH where these aren't supported.

// Handle static assets
const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath))

// EJS templating
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Used for POST and PUT requests only (not GET and DELETE) to send data and recognises objects as strings or arrays
app.use(express.urlencoded({ extended: true }))

// App middleware = methods, functions, operations called between processing the request and sending the response
// Change secret to process.env.SECRET once up and running
app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.session())
// User available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use('/', homeRouter)

// This catches any last moment errors, so must go at the bottom of this file
app.use((err, req, res, next) => {
  console.error(err)

  if (err instanceof CustomError) {
    return res.status(err.statusCode).render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : null
    })
  }

  res.status(err.statusCode || 500).render('error', {
    message: err.message || 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err : null
  })
})

// Railway: Do I need to add '|| 8080' or does it come as an automatic variable?
// This normally goes at the end, but you can place it anywhere in this file
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Members only app - listening on port ${process.env.PORT}`)
})
