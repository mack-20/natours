const { Router } = require('express')
const { createUser } = require('../controllers/userControllers')

const userRouter = new Router()

userRouter.route('/').post(createUser)



module.exports = userRouter