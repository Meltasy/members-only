const { query } = require('../db/pool')
const db = require('../db/queries')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

async function getMessages(req, res) {
  const messages = await db.getAllMessages()

  res.render('home', {
    user: req.user,
    title: 'Message Board',
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

function updateMemberGet(req, res) {
  res.render('membership', {
    title: 'Membership',
    message: ''
  })
}

async function updateMemberPost(req, res, next) {
  if (req.body.passcode === process.env.MEMBERSHIP) {
    const user = req.user
    await db.makeMember(user.user_id)
    res.redirect('/')
  } else {
    res.render('membership', {
      title: 'Membership',
      message: 'The membership passcode is incorrect.'
    })
  }
}

module.exports = {
  getMessages,
  createUserGet,
  createUserPost,
  logInUser,
  logOutUser,
  updateMemberGet,
  updateMemberPost
}
