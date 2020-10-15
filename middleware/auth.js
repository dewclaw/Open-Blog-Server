const jwt = require('jsonwebtoken');



const auth = async (req,res,next) => { 
    const authHeader = req.headers.authorization;
    console.log('auth middleware')

    if(authHeader) { 
        const token = authHeader.split(' ')[1];
        try {
            let user = await jwt.decode(token, process.env.JWT_SECRET);
            if(!user) {
                res.status(401);
                next(new Error('not authorized'))
            } else { 
                req.user = user;
                console.log(req.user);
                res.status(200);
                next()
            }
        } catch (error) {
            res.status(500);
            next(new Error('Server error in handling auth middleware'))
        }
    } else {
        res.status(401);
        next(new Error('Not authorized'))
    }
}

module.exports = auth;