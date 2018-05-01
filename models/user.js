var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema( {
  username: String,
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  rating: Number, 
  email: String,
  isAdmin: {type: Boolean, default: false},
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, //laczy user z zarejestrowanymi
            ref: 'Comment'
        
    }
   }
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('user', userSchema);