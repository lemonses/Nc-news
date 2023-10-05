const userRouter = require('express').Router()
const {getUsers,getUser} = require('../controllers/users.controllers.js')

userRouter.get('/',getUsers)
userRouter.get('/:username',getUser)

module.exports = userRouter