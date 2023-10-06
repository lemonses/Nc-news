const { db } = require('../connection.js')
const format = require('pg-format')

exports.fetchArticle = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        LEFT JOIN (SELECT article_id,
            COUNT(article_id) AS comment_count
            FROM comments
            GROUP BY comments.article_id)
        AS comment_values 
        ON comment_values.article_id = articles.article_id
        WHERE articles.article_id = $1
        ORDER BY created_at DESC;
    `,[article_id]).then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404,message:'Article doesn\'t exist'})
        }
        return result.rows[0]
    })
}

exports.fetchArticles = (topic = '%',sort_by = 'created_at',order = 'DESC') => {
        const queryStr = format(`
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
        WHERE articles.topic LIKE %L 
        ORDER BY %s %s;
    `,topic,sort_by,order)
    return db.query(queryStr).then(({rows})=>{
        return rows
    })
}

exports.insertComment = (article_id,newComment) => {
    queryArr = [newComment.username,newComment.body,article_id]
        return db.query(`
            INSERT INTO comments
            (author,body,article_id)
            VALUES
            ($1,$2,$3)
            RETURNING *;
            `,queryArr
        ).then((result)=>{
            return result.rows[0]
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

exports.updateArticle = (article_id,body) => {
    const addVotes = body.inc_votes
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `,[addVotes,article_id]).then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404,message:'Article doesn\'t exist'})
        }
        return result.rows[0]
    })
}

exports.insertArticle = ({author,title,body,topic,article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'}) => {
    return db.query(`
        INSERT INTO articles
        (author,title,body,topic,article_img_url)
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *;
    `,[author,title,body,topic,article_img_url]).then((result)=>{
        const newID = result.rows[0].article_id
        return db.query(`
        SELECT *
        FROM articles
        LEFT JOIN (SELECT article_id,
            COUNT(article_id) AS comment_count
            FROM comments
            GROUP BY comments.article_id
        ) AS comment_values 
        ON comment_values.article_id = articles.article_id
        WHERE articles.article_id = $1
        ORDER BY created_at DESC;
        `,[newID]).then((result)=>{
            return result.rows[0]
        })
        
    })
}