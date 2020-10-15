const Joi = require('joi');

const Post = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    author: Joi.string().required()
});

module.exports = Post;