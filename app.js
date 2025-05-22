require('dotenv').config()
const express = require('express')
const app = express()
const path = require('node:path')
const assetsPath = path.join(__dirname, 'public')

// Will need to install and use method-override to use DELETE, PUT and PATCH where these aren't supported.

const homeRouter = require('./routes/homeRouter')

// Middleware = methods, functions, operations called between processing the request and sending the response

// Allows you to create ejs files in the views folder and use them in your app without further mention
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Used for serving static files, e.g. CSS files, javascript files, image files
app.use(express.static(assetsPath))
// Used for POST and PUT requests only (not GET and DELETE) to send data and recognises objects as strings or arrays
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRouter)

// This catches any last moment errors, so must go at the bottom of this file
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).render('error', {
    message: err.message || 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err : null
  })
})

// Railway: Do I need to add '|| 8080' or does it come as an automatic variable?
// This normally goes at the end, but you can place it anywhere in this file
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Members only app - listening on port ${PORT}`)
})
