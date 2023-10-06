const articlesRouter = require('express').Router()
const {getArticle,getArticles,getComments,patchArticle,postComment,postArticle} = require('../controllers/articles.controller.js')


articlesRouter.route('/')
.get(getArticles)
.post(postArticle)

articlesRouter.get('/:article_id/comments',getComments)

articlesRouter.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articlesRouter.post('/:article_id/comments',postComment)

module.exports = articlesRouter