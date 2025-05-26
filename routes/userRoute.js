const { Router } = require('express')
const { createUser } = require('../controllers/userControllers')
const { signup } = require('../controllers/authController')

const userRouter = new Router()

userRouter.route('/').post(createUser)

userRouter.route('/signup').post(signup)



module.exports = userRouter