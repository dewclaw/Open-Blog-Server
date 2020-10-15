
let Joi = require('joi');


let ReturningUser = Joi.object({
    emailAddress: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

module.exports = ReturningUser; 