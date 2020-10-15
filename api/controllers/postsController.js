const PostJoi = require('../joiSchemas/Post');
const BlogPost = require('../../models/BlogPost');
const BlogUser = require('../../models/BlogUser');


// const thePost = { 
//     title: {
//         type: String,
//         required: true,
//         unique: false
//     }, 
//     description: {
//         type: String,
//         required: true,
//         unique: false
//     }, 
//     author: {
//         type: String,
//         required: true,
//         unique: false
//     }
// }
exports.getAll = (req,res,next) => { 
    BlogPost.find((error,AllPosts) => {
        if(error) {
            res.status(500);
            next(new Error('Error finding posts'));
        } else { 
            res.status(200);
            res.json(AllPosts);
        }
    });
}

exports.newPost = async (req,res,next) => {
    let newPost = {
        title: req.body.title,
        description: req.body.description, 
        author: req.user.username
    };
    const { error, result } = PostJoi.validate(newPost);
    if(error) { 
        res.status(400);
        next(new Error(error.message))
    } else {
        validPost = new BlogPost(newPost);
        validPost.save((error,document) => {
            if(error) { 
                res.status(500);
                next(new Error(error.message))
            } else { 
                BlogUser.findById(req.user.id, (error,userDocument) => {
                    if(error) { 
                        res.status(500);
                        console.error(error)
                        next(new Error(error))
                    } else { 
                        userDocument.postIds.push(document.id);
                        userDocument.save((error,newDoc) => {
                            if(error) { 
                                res.status(500);
                                next( new Error(error.message))
                            } else { 
                                res.status(201);
                                res.json(document)
                            }
                        })
                    }
                })
            }
        })
    }
};

exports.editPostById = (req,res,next ) => {
    let pID = req.params.id;
    console.log("Post to update is, ", pID)
    let updatedContent = {
        title: req.body.title,
        description: req.body.description,
        author : req.user.username
    };
    const {error, result } = PostJoi.validate(updatedContent);
    if(error) { 
        res.status(400);
        next(new Error(error.message))
    } else { 
        BlogPost.findById(pID, (err,postDocument) => {
            if(err) { 
                res.status(500);
                next(new Error(err.message))
            } else { 
                if(!postDocument) { 
                    res.status(404);
                    next(new Error('Post does not exists'))
                } else { 
                    if(req.user.username != postDocument.author) { 
                        res.status(401);
                        next(new Error('Not authorized to edit this post'))
                    } else { 
                        postDocument.title = updatedContent.title;
                        postDocument.description = updatedContent.description;
                        postDocument.save((err,doc) => { 
                            if(err) { 
                                res.status(500);
                                next(new Error('Server error in saving. Please try again'))
                            } else { 
                                res.status(201);
                                res.json(doc);
                            }
                        })
                    }
                }
            }
        })
    }
};

exports.getPostById = (req,res,next) => { 
    let pID = req.params.id;
    BlogPost.findById(pID, (error,document) => { 
        if(error) { 
            res.status(500);
            next(new Error(error.message))
        } else { 
            if(!document){
                res.status(404);
                next()
            } else { 
                res.json(document)
            }
        }
    })
}

exports.deletePostById = (req,res,next) => { 
    let pID = req.params.id;
}

exports.addComment = (req,res,next) => { 
    let pID = req.params.id;

}