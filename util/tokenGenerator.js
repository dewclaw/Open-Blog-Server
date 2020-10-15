const jwt = require('jsonwebtoken');


const tokenGenerator = (acc, next) => {

    jwt.sign(acc.id, process.env.JWT_SECRET,{expiresIn: "1h"},(err,token) => {
        if(err) {
            next(new Error('Error signing token payload'))
        } else {
            return token
        }
    });
}



module.exports = tokenGenerator;