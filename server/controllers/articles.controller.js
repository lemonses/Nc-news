const {fetchArticle,fetchArticles,fetchComments,updateArticle,removeComment, getComment,insertComment} = require('../models/articles.model.js')
const {fetchUser} = require('../models/users.models.js')
const {fetchTopic} = require('../models/topics.model.js')

exports.getArticle = (req,res,next) => {
    const {article_id} = req.params
    fetchArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getArticles = (req,res,next) => {
    const {topic} = req.query
    Promise.all([fetchArticles(topic),fetchTopic(topic)])
    .then(([articles]) => {
        res.status(200).send({articles})
    }).catch((err)=>{
        next(err)
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
        next(err)
    })
}

exports.getComments = (req,res,next) => {
    const {article_id} = req.params
    let promises = [fetchComments(article_id),fetchArticle(article_id)]
    Promise.all(promises).then(([comments]) => {
        res.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}

exports.patchArticle = (req,res,next) => {
    const {body} = req
    const {article_id} = req.params
    updateArticle(article_id,body).then((article)=>{
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req,res,next) => {
    const {comment_id} = req.params
    getComment(comment_id).then(()=>{
        return removeComment(comment_id)
    })
    .then(()=>{
        res.status(204).send()
    }).catch((err)=>{
        next(err)
    })
}