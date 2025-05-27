const { Router } = require('express')
const messageRouter = Router()
const messageController = require('../controllers/messageController')
const passport = require('../authentication/passport')

messageRouter.get('/', messageController.getMessages)

messageRouter.get('/log-in', messageController.logInUser)
messageRouter.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in'
}))
messageRouter.get('/log-out', messageController.logOutUser)

messageRouter.get('/new-message', messageController.newMessageGet)
messageRouter.post('/new-message', messageController.newMessagePost)

messageRouter.post('/delete', messageController.deleteMessage)

module.exports = messageRouter
