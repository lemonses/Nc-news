const {fetchArticle,fetchArticles,insertComment} = require('../models/articles.model.js')
const {fetchUser} = require('../models/users.models.js')

exports.getArticle = (req,res,next) => {
    const {article_id} = req.params
    fetchArticle(article_id).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles)=>{
        res.status(200).send({articles})
    })
}

exports.postComment = (req,res,next) => {
    const {body} = req
    const {article_id} = req.params
    const promises = [fetchArticle(article_id),fetchUser(body.username)]
    Promise.all(promises).then(()=>{
        return insertComment(article_id,body)
    }).then((comment) => {
        res.status(201).send({comment})
    }).catch((err)=>{
        console.log(err)
        next(err)
    })
}