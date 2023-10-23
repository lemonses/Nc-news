const express = require('express')
const {handleCustomErrors, handlePSQLErrors,handle500} = require('./controllers/errors.controller.js')
const apiRouter = require('./routes/api-router.js')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api',apiRouter)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handle500)

app.all('/*',(req,res,next) => {
    res.status(404).send({message:'Path not found'})
})

module.exports = app