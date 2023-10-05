const express = require('express')
const {getArticle,getArticles,getComments,patchArticle,deleteComment,postComment} = require('./controllers/articles.controller.js')
const {handleCustomErrors, handlePSQLErrors,handle500} = require('./controllers/errors.controller.js')
const {getTopics,getApi} = require('./controllers/topics.controller.js')
const {getUsers} = require('./controllers/users.controllers.js')

const app = express()

app.use(express.json())

app.get('/api',getApi)
app.get('/api/topics',getTopics)
app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id',getArticle)
app.get('/api/articles/:article_id/comments',getComments)
app.get('/api/users',getUsers)

app.patch('/api/articles/:article_id',patchArticle)

app.delete('/api/comments/:comment_id',deleteComment)

app.post('/api/articles/:article_id/comments',postComment)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handle500)

app.all('/*',(req,res,next) => {
    res.status(404).send({message:'Path not found'})
})

module.exports = app