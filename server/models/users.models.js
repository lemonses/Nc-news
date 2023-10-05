const {db} = require('../connection.js')

exports.fetchUser = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1;
    `,[username]).then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404, message:"User not found"})
        }
        return result.rows[0]
    })
}

exports.fetchUsers = () => {
    return db.query(`
        SELECT * FROM users;
    `).then((result)=>{
        return result.rows
    })
}