const {removeComment, getComment, updateComment} = require('../models/comments.model')

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

exports.patchComment = (req,res,next) => {
    const {inc_votes} = req.body
    const {comment_id} = req.params
    updateComment(comment_id,inc_votes).then((comment)=>{
        res.status(200).send({comment})
    }).catch((err)=>{
        next(err)
    })
}