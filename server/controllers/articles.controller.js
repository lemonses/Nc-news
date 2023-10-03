const {fetchArticle,fetchArticles,fetchComments} = require('../models/articles.model.js')

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