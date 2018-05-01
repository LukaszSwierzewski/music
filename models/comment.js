var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    rating: Number,
            
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, //laczy user z zarejestrowanymi
            ref: 'User'
        },
        username: String,
        avatar: String
    }
});







module.exports = mongoose.model('Comment', commentSchema); // WAZNE!! "Comment" to ref w plyty.js