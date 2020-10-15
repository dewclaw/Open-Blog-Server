const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    emailAddress: { 
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type : String,
        required: true,
        unique: true
    },
    postIds : {
        type: [String],
        required: false,
        unique: false,
    },
});

// someUser = {
//     username: 'dewclaw',
//     emailAddress: 'email@gmail.com',
//     password: 'hashedpassword',
//     postIds: ['postid1', 'postid2'],
//     comments: 'Comment TYPE'
// }

module.exports = mongoose.model('User', userSchema);

