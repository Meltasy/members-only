const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')
const passport = require('../authentication/passport')
const { validateNewUser } = require('../validations/userValidation')

homeRouter.get('/', homeController.getMessages)
homeRouter.get('/new-user', homeController.createUserGet)
homeRouter.post('/new-user', validateNewUser, homeController.createUserPost)

homeRouter.get('/log-in', homeController.logInUser)
homeRouter.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in'
}))

homeRouter.get('/log-out', homeController.logOutUser)

homeRouter.get('/membership', homeController.updateMemberGet)
homeRouter.post('/membership', homeController.updateMemberPost)

module.exports = homeRouter
