const {fetchArticle,fetchArticles,fetchComments,updateArticle,insertComment,insertArticle} = require('../models/articles.model.js')
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
    const {topic,sort_by,order,limit,p} = req.query
    Promise.all([fetchArticles(topic,sort_by,order,limit,p),fetchTopic(topic)])
    .then(([[total_count,articles]]) => {
        if(limit || p){
            res.status(200).send({total_count,articles})
        }else{res.status(200).send({articles})}
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
    const {limit,p} = req.query
    let promises = [fetchComments(article_id,limit,p),fetchArticle(article_id)]
    Promise.all(promises).then(([[total_count,comments]]) => {
        if(limit || p){
            res.status(200).send({comments,total_count})
        }else{res.status(200).send({comments})}
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

exports.postArticle = (req,res,next) => {
    insertArticle(req.body).then((article) =>{
        res.status(200).send({article})
    }).catch((err)=>{
        next(err)
    })
}