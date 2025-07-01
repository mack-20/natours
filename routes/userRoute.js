const { Router } = require('express')
const { createUser } = require('../controllers/userControllers')
const { signup, signin, forgotPassword, resetPassword, updatePassword, protect } = require('../controllers/authController')

const userRouter = new Router()

userRouter.route('/signup').post(signup)
userRouter.route('/signin').post(signin)

userRouter.route('/forgot-password').post(forgotPassword)
userRouter.route('/reset-password/:token').patch(resetPassword)
userRouter.route('/updateMyPassword').patch(protect, updatePassword)

module.exports = userRouter