const db = require('../db/queries')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

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
    res.redirect('/log-in')
  } catch (err) {
    return next(err)
  }
}

function updateMemberGet(req, res) {
  res.render('membership', {
    user: req.user,
    title: 'Membership',
    message: ''
  })
}

async function updateMemberPost(req, res, next) {
  try {
    if (req.body.passcode === process.env.MEMBERSHIP) {
      const user = req.user
      await db.makeMember(user.user_id)
      res.redirect('/')
    } else {
      res.render('membership', {
        user: req.user,
        title: 'Membership',
        message: 'The membership passcode is incorrect.'
      })
    }
  } catch (err) {
    return next(err)
  }
}

function updateAdminGet(req, res) {
  res.render('admin', {
    user: req.user,
    title: 'Admin Rights',
    message: ''
  })
}

async function updateAdminPost(req, res, next) {
  try {
    if (req.body.adminCode === process.env.ADMIN_CODE) {
      const user = req.user.user_id
      await db.makeAdmin(user)
      res.redirect('/')
    } else {
      res.render('admin'), {
        user: req.user,
        title: 'Admin Rights',
        message: 'The admin code is incorrect.'
      }
    }
  } catch (err) {
    return next(err)
  } 
}

module.exports = {
  createUserGet,
  createUserPost,
  updateMemberGet,
  updateMemberPost,
  updateAdminGet,
  updateAdminPost
}
