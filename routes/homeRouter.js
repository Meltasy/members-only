const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')
const { validateNewUser } = require('../validations/userValidation')

// homeRouter.get('/', homeController.getMessages)
homeRouter.get('/newUser', homeController.createUserGet)
homeRouter.post('/newUser', validateNewUser, homeController.createUserPost)

module.exports = homeRouter
