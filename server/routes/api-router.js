const apiRouter = require('express').Router()
const {articlesRouter,usersRouter,commentsRouter} = require('./')
const {getTopics,getApi,postTopic} = require('../controllers/topics.controller.js')

apiRouter.use('/articles',articlesRouter)
apiRouter.use('/users',usersRouter)
apiRouter.use('/comments',commentsRouter)

apiRouter.get('/',getApi)
apiRouter.route('/topics')
.get(getTopics)
.post(postTopic)

module.exports = apiRouter