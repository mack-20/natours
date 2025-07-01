const { Router } = require('express')
const { createUser } = require('../controllers/userControllers')
const { signup, signin, forgotPassword, resetPassword } = require('../controllers/authController')

const userRouter = new Router()

userRouter.route('/signup').post(signup)
userRouter.route('/signin').post(signin)

userRouter.route('/forgot-password').post(forgotPassword)
userRouter.route('/reset-password').patch(resetPassword)


module.exports = userRouter