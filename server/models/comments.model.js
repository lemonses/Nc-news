const  db  = require('../../db/connection.js')

exports.removeComment = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        where comment_id = $1;
    `,[comment_id])
}

exports.getComment = (comment_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE comment_id = $1;
    `,[comment_id]).then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404,message:'Comment doesn\'t exist'})
        }
        return result.rows[0]
    })
}

exports.updateComment = (comment_id,inc_votes) => {
    return db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;
    `,[inc_votes,comment_id]).then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404,message:'Comment doesn\'t exist'})
        }
        return result.rows[0]
    })
}