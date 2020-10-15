const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    }, 
    description: {
        type: String,
        required: true,
        unique: false
    }, 
    author: {
        type: String,
        required: true,
        unique: false
    },
});

module.exports = mongoose.model('BlogPost', postSchema);

