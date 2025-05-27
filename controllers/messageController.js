const db = require('../db/queries')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

async function getMessages(req, res) {
  try {
    const messages = await db.getAllMessages()
    res.render('home', {
      user: req.user,
      title: 'Message Board',
      messages: messages
    })
  } catch (err) {
    return next(err)
  }
}

function logInUser(req, res) {
  res.render('logIn', {
    title: 'Log In'
  })
}

function logOutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
}

function newMessageGet(req, res) {
  res.render('newMessage', {
    user: req.user,
    title: 'New Message'
  })
}

async function newMessagePost(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new CustomError(`New user validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
    }
    const user = req.user
    const { title, message } = req.body
    await db.insertMessage(user.user_id, title, message)
    res.redirect('/')
  } catch (err) {
    return next(err)
  }
}

async function deleteMessage(req, res, next) {
  try {
    const { messageId } = req.body
    await db.deleteMessage(messageId)
    res.redirect('/')
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  getMessages,
  logInUser,
  logOutUser,
  newMessageGet,
  newMessagePost,
  deleteMessage
}
