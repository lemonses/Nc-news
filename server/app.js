const express = require('express')
const {getArticle,getArticles,getComments} = require('./controllers/articles.controller.js')
const {handleCustomErrors, handlePSQLErrors} = require('./controllers/errors.controller.js')
const {getTopics,getApi} = require('./controllers/topics.controller.js')

const app = express()

app.get('/api',getApi)
app.get('/api/topics',getTopics)
app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id',getArticle)
app.get('/api/articles/:article_id/comments',getComments)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)

app.all('/*',(req,res,next) => {
    res.status(404).send({message:'Path not found'})
})
app.use(handleCustomErrors)

module.exports = app