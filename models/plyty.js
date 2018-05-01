var mongoose = require('mongoose');

var plytySchema = new mongoose.Schema({
   name: String,
   image: String,
   price: Number,
   opis: String,
   youtube: String,
   track1: String,
   track2: String,
   track3: String,
   track4: String,
   track5: String,
   track6: String,
   track7: String,
   track8: String,
   track9: String,
   track10: String,
   track11: String,
   track12: String,
   track13: String,
   track14: String,
   track15: String,
   track16: String,
   createdAt: {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [ // to nizej dodaje schemat komentarzy jako array wiecej info w comment.js
       {
           type: mongoose.Schema.Types.ObjectId, // wyszukuje schemat po ID refem jest Comment
           ref: "Comment" //DZIEKI TEMU LACZY SIE Z comment.js
       }, {
       Avatar: String,
       }
       ]
       
    
});

module.exports = mongoose.model("plytyy", plytySchema);