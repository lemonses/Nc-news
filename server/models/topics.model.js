const { db } = require('../connection.js')

exports.fetchTopics = () => {
    return db.query(`
        SELECT * FROM topics
    `).then((result)=>{
        return result.rows
    })
}