
let Joi = require('joi');


let BlogUserJoi = Joi.object({
    username: Joi.string().alphanum().min(4).max(20).required(),
    emailAddress: Joi.string().required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()

});


module.exports = BlogUserJoi;
