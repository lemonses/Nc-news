const {fetchArticle,fetchArticles,fetchComments,updateArticle} = require('../models/articles.model.js')

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
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
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
    fetchArticle(article_id).then(()=>{
        return updateArticle(article_id,body)
    }).then((article)=>{
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}