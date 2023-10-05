const apiRouter = require('express').Router()
const articlesRouter = require('./articles-router')
const {deleteComment} = require('../controllers/articles.controller.js')
const {getTopics,getApi} = require('../controllers/topics.controller.js')
const {getUsers} = require('../controllers/users.controllers.js')

apiRouter.use('/articles',articlesRouter)

apiRouter.get('/',getApi)
apiRouter.get('/topics',getTopics)
apiRouter.get('/users',getUsers)

apiRouter.delete('/comments/:comment_id',deleteComment)

module.exports = apiRouter