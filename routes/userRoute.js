const { Router } = require('express')
const { createUser } = require('../controllers/userControllers')
const { signup, signin } = require('../controllers/authController')

const userRouter = new Router()

userRouter.route('/signup').post(signup)
userRouter.route('/signin').post(signin)



module.exports = userRouter