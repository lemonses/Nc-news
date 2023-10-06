exports.handleCustomErrors = (err,req,res,next) => {
    console.log(err)
    if(err.status){
        res.status(err.status).send({message:err.message})
    } else {next(err)}
}

exports.handlePSQLErrors = (err,req,res,next) => {
    console.log(err)
    if(err.code === '22P02' || '23503' || '23502'){
        res.status(400).send({ message: 'Bad request' })
    }else {next(err)}
}

exports.handle500 = (err,req,res,next) => {
    console.log(err)
    next(err)
}