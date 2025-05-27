const { Router } = require('express')
const userRouter = Router()
const userController = require('../controllers/userController')
const { validateNewUser } = require('../validations/userValidation')

userRouter.get('/new-user', userController.createUserGet)
userRouter.post('/new-user', validateNewUser, userController.createUserPost)

userRouter.get('/membership', userController.updateMemberGet)
userRouter.post('/membership', userController.updateMemberPost)

userRouter.get('/admin', userController.updateAdminGet)
userRouter.post('/admin', userController.updateAdminPost)

module.exports = userRouter
