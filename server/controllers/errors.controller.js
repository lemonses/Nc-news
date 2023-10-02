exports.handleCustomErrors = (err,req,res,next) => {
    if(err.status){
        res.status(err.status).send({message:err.message})
    }
    next(err)
}

exports.handlePSQLErrors = (err,req,res,next) => {
    if(err.code === '22P02'){
        res.status(404).send({ message: 'Invalid id' })
    }
    next(err)
}