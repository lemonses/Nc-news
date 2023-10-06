const  db  = require('../../db/connection.js')
const endpoints = require('../../endpoints.json')
const format = require('pg-format')

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

exports.fetchTopic = (topic = '%') => {
    const topicQuery = format(`
    SELECT * FROM topics
    WHERE slug LIKE %L;
    `,topic)
    return db.query(topicQuery)
    .then((result)=>{
        if(result.rows.length === 0) {
            return Promise.reject({status:404,message:'Topic not found'})
        }
        return result.rows[0]
    })
}