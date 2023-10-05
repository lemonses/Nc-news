const apiRouter = require('express').Router()
const {articlesRouter,usersRouter,commentsRouter} = require('./')
const {getTopics,getApi} = require('../controllers/topics.controller.js')

apiRouter.use('/articles',articlesRouter)
apiRouter.use('/users',usersRouter)
apiRouter.use('/comments',commentsRouter)

apiRouter.get('/',getApi)
apiRouter.get('/topics',getTopics)

module.exports = apiRouter