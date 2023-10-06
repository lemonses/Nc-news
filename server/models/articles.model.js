const  db  = require('../../db/connection.js')
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

exports.fetchArticles = (topic = '%',sort_by = 'created_at',order = 'DESC',limit,p) => {   
    let stringForFormat = `
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
    ORDER BY %s %s`
    let query = [topic,sort_by,order]
    if(limit || p){
        if(!limit){
            limit = '10'
        }
        if(!p){
            p = 1
        }
        query.push((p-1) * limit)
        stringForFormat += ` OFFSET %s ROWS LIMIT %s;`
        query.push(limit)
    }
    const queryStr = format.withArray(stringForFormat,query)
    return db.query(queryStr).then(({rows})=>{
        if(rows.length === 0 && limit && p){
            return Promise.reject({status:404,message:'Page not found'})
        }
        return Promise.all([db.query(`SELECT COUNT(*) FROM articles WHERE topic LIKE $1;`,[topic]),rows])
    }).then((result)=>{
        return [result[0].rows[0].count,result[1]]
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

exports.fetchComments = (article_id,limit,p) => {
    let stringForFormat = `
    SELECT * FROM comments
    WHERE article_id = %s
    ORDER BY created_at DESC
`
    let query = [article_id]
    if(limit || p){
        if(!limit){
            limit = '10'
        }
        if(!p){
            p = 1
        }
        query.push((p-1) * limit)
        stringForFormat += ` OFFSET %s ROWS LIMIT %s;`
        query.push(limit)
    }

    const queryStr = format.withArray(stringForFormat,query)
    return db.query(queryStr).then((result)=>{
        if(result.rows.length === 0 && p){
            return Promise.reject({status:404,message:'Page not found'})
        }
        return Promise.all([db.query(`SELECT COUNT(*) FROM comments WHERE article_id = $1;`,[article_id]),result.rows])
    }).then((result)=>{
        return [result[0].rows[0].count,result[1]]
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