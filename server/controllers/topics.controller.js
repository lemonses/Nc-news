const {fetchTopics,fetchApi} = require('../models/topics.model.js')

exports.getTopics = (req,res,next) => {
    fetchTopics().then((topics)=>{
        res.status(200).send({topics})
    })   
}

exports.getApi = (req,res,next) => {
    const endpoints = fetchApi()
    const response = JSON.stringify(endpoints)
    res.status(200).send({response})
}