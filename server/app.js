const express = require('express')
const {getTopics} = require('./controllers/topics.controller.js')

const app = express()

app.get('/api/topics',getTopics)

app.all('/*',(req,res,next) => {
    res.status(404).send({message:'Path not found'})
})

module.exports = app