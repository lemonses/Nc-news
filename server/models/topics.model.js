const { db } = require('../connection.js')
const fs = require('fs/promises')
const endpoints = require('../../endpoints.json')

exports.fetchTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `).then((result)=>{
        return result.rows
    })
}

exports.fetchApi = () => {
    return endpoints
}