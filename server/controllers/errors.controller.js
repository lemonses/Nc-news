exports.handleCustomErrors = (err,req,res,next) => {
    if(err.status){
        res.status(err.status).send({message:err.message})
    }
    next(err)
}

exports.handlePSQLErrors = (err,req,res,next) => {
    if(err.code === '22P02'){
        res.status(400).send({ message: 'Invalid id' })
    }
    if(err.code === '23503'){
        res.status(400).send({ message: 'Bad request' })
    }
    next(err)
}