require('dotenv').config()
const express = require('express')
const app = express()
const path = require('node:path')
const session = require('express-session')
const passport = require('./authentication/passport')
const CustomError = require('./errors/CustomError')

const messageRouter = require('./routes/messageRouter')
const userRouter = require('./routes/userRouter')

// Handle static assets
const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath))

// EJS templating
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Used for POST and PUT requests only (not GET and DELETE)
app.use(express.urlencoded({ extended: true }))

// App middleware
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.session())
// User available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use('/', messageRouter)
app.use('/user', userRouter)

// Catches any final errors - must stay at end
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
// Normally at end - but can sit anywhere
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Members only app - listening on port ${process.env.PORT}`)
})
