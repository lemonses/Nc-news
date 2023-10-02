const express = require('express')
const {getTopics,getApi} = require('./controllers/topics.controller.js')

const app = express()

app.get('/api',getApi)
app.get('/api/topics',getTopics)

app.all('/*',(req,res,next) => {
    res.status(404).send({message:'Path not found'})
})

module.exports = app