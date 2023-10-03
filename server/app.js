const express = require('express')
const {getArticle,getArticles,postComment} = require('./controllers/articles.controller.js')
const {handleCustomErrors, handlePSQLErrors} = require('./controllers/errors.controller.js')
const {getTopics,getApi} = require('./controllers/topics.controller.js')

const app = express()

app.use(express.json())

app.get('/api',getApi)
app.get('/api/topics',getTopics)
app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id',getArticle)

app.post('/api/articles/:article_id/comments',postComment)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)

app.all('/*',(req,res,next) => {
    res.status(404).send({message:'Path not found'})
})

module.exports = app