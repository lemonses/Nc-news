const apiRouter = require('express').Router()
const {articlesRouter,userRouter} = require('./')
const {deleteComment} = require('../controllers/articles.controller.js')
const {getTopics,getApi} = require('../controllers/topics.controller.js')

apiRouter.use('/articles',articlesRouter)
apiRouter.use('/users',userRouter)

apiRouter.get('/',getApi)
apiRouter.get('/topics',getTopics)

apiRouter.delete('/comments/:comment_id',deleteComment)

module.exports = apiRouter