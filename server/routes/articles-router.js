const articlesRouter = require('express').Router()
const {getArticle,getArticles,getComments,patchArticle,deleteComment,postComment} = require('../controllers/articles.controller.js')


articlesRouter.get('/',getArticles)

articlesRouter.get('/:article_id/comments',getComments)

articlesRouter.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articlesRouter.post('/:article_id/comments',postComment)

module.exports = articlesRouter