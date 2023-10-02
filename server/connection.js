const {Pool} = require('pg')
const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

dotenv.config({
    path: `${__dirname}/../.env.${ENV}`
})

if(!process.env.PGDATABASE){
    throw new Error ('PGDATABASE not set')
}

exports.db = new Pool()