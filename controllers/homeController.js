const { query } = require('../db/pool')
const db = require('../db/queries')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

async function getMessages(req, res) {
  const messages = await db.getAllMessages()

  res.render('home', {
    title: '',
    messages: messages
  })
}

function createUserGet(req, res) {
  res.render('newUser', {
    title: 'New User'
  })
}

async function createUserPost(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new CustomError(`New user validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
    }
    const { firstName, lastName, username, password } = req.body
    await db.insertUser(firstName, lastName, username, password)
    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getMessages,
  createUserGet,
  createUserPost
}
