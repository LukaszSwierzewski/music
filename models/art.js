var mongoose = require('mongoose');


var artSchema = new mongoose.Schema({
   name1: String,
   image1: String,
   opis1: String,
   createdAt: {type: Date, default: Date.now}
    
});


   module.exports = mongoose.model("art", artSchema);
  