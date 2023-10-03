const { db } = require('../connection.js')

exports.fetchArticle = (article_id) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
    `,[article_id]).then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404,message:'Article doesn\'t exist'})
        }
        return result.rows[0]
    })
}

exports.fetchArticles = () => {
    return db.query(`
        SELECT articles.article_id,
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        comment_values.comment_count
        FROM articles
        LEFT JOIN (SELECT article_id,
        COUNT(article_id) AS comment_count
        FROM comments
        GROUP BY comments.article_id)
        AS comment_values 
        ON comment_values.article_id = articles.article_id
        ORDER BY created_at DESC;
    `).then(({rows})=>{
         return rows
    })
}

exports.fetchComments = (article_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `,[article_id]).then((result)=>{
        return result.rows
    })
}