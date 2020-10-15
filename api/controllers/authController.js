const BlogUser = require('../../models/BlogUser');
const bcrypt = require('bcrypt');
const BlogUserJoi = require('../joiSchemas/BlogUser');
const Joi = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');
// const tokenGenerator = require('../../util/tokenGenerator');
const jwt = require('jsonwebtoken');
const ReturningUserJoi = require('../joiSchemas/ReturningUser');
const BlogPost = require('../../models/BlogPost');

exports.getme = (req,res,next) => { 
    if(!req.user.id) {
        res.status(401);
        next(new Error('You are not logged in.'))
    } else { 
        BlogUser.findById(req.user.id, (error,userdocument) => {
            if(error) { 
                res.status(500);
                next(new Error(error.message))
            } else { 
                res.status(200);
                res.json(userdocument);
            }
        })
    }
}

exports.getMyPosts = async (req,res,next) => { 
    if(!req.user.id) { 
        res.status(401);
        next(new Error(' You are not logged in.'))
    } else { 
        BlogUser.findById(req.user.id, async (error,userdocument) => {
            if(error) { 
                res.status(500);
                next(new Error(error.message))
            } else { 
                let postIds = userdocument.postIds;
                let allPosts = []
                for(const postId of postIds) { 
                    await BlogPost.findById(postId, (err,postDoc) => { 
                        if(err) { 
                            res.status(500)
                            next( new Error(error.message))
                        } else { 
                            // console.log(allPosts)
                            allPosts.push(postDoc)
                        }
                    })
                }
                
                res.status(200).json(allPosts);
            }
        })
    }
}
exports.signup = (req,res,next) => {
    console.log(req.body);
    let newUser = {
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        password: req.body.password
    };

    const {error,result} = BlogUserJoi.validate(newUser);

    if(error){
        res.status(400);
        next(error);
    } else {
        BlogUser.findOne({emailAddress: newUser.emailAddress}, (err,object) => {
            if(err) { 
                res.status(500);
                next(new Error('Server error in finding user'))
            }
            if(object) { 
                res.status(400);
                next(new Error('User already exists'))
            } else {
                bcrypt.hash(newUser.password, 10, (err,hash) => {
                    if(err) { 
                        res.status(500);
                        next(new Error('Cannot hash password, try again later.'))
                    } else { 
                        console.log(hash)
                        newUser.password = hash;
                        console.log(newUser.password);
                        let newUserToSave = new BlogUser({
                            username: newUser.username,
                            password: newUser.password,
                            emailAddress: newUser.emailAddress
                        });
                        newUserToSave.save((err,doc) => {
                            if(err) { 
                                res.status(500);
                                next(new Error('Error saving in database. Try again later.'))
                            } else {
                                let payload = {
                                    id: doc.id,
                                    username: doc.username
                                };
                                jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
                                    if(err) { 
                                        res.status(500);
                                        next(new Error('Error signing token'))
                                    } else { 
                                        res.status(201).json({authToken: token})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
};

exports.login = async (req,res,next) => {
    const returningUser = { 
        emailAddress: req.body.emailAddress,
        password: req.body.password,
    }
    /**
     * 1. Validate the information being sent us
     * 2. Check the DB to see if this user account exists
     * 3. check the password being sent to us vs the hashed password that is stored
     * 4. Send auth token back 
     */
    const {error, result} = ReturningUserJoi.validate(returningUser);
    console.log(error);
    console.log(result)
    if(error) { 
        res.status(400);
        next(new Error(error.message))
    } else {
        try {
            let user = await BlogUser.findOne({emailAddress: req.body.emailAddress})
            if(!user) { 
                res.status(400);
                next(new Error('User does not exist'))
            } else {
                bcrypt.compare(returningUser.password,user.password,(err,isSame) => {
                    if(err) { 
                        res.status(500);
                        next(new Error('Server error in comparing the password'))
                    } else { 
                        if(isSame) {
                            console.log(user.username);
                            const payload = {
                                id: user.id,
                                username: user.username
                            }
                            jwt.sign(payload, process.env.JWT_SECRET, (err,token) => {
                                if(err) { 
                                    res.status(500);
                                    next(new Error('Server error in signing token'))
                                } else { 
                                    res.status(200).json({authToken: token})
                                }
                            })
                        } else { 
                            res.status(400);
                            next(new Error('Bad login information'))
                        }
                    }
                })
            }
        } catch (error) {
            res.status(500);
            next(new Error('Server error in finding user'))
        }
        
    }
}