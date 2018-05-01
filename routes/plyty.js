var express = require('express');
var router = express.Router();
var plytyy = require('../models/plyty');
var art = require('../models/art');
var user = require('../models/user');
var middleware = require('../middleware');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dtr2jkhnr', 
  api_key: "945494947849195",
  api_secret: "ut4shamChT3p8fZO5lm9GlnzHhM"
});




router.get('/', function(req, res) {
    plytyy.find({}).sort({_id: -1}).exec(function (err, plytaNowa) {
        if(err) {
            console.log(err);
        }
    
        art.find({}).sort({_id: -1}).exec(function (err, art) {
            if(!err)
            res.render('index', {
                albumy: plytaNowa,
                art: art,
                user: user
            });
        });
   
    });     
        
});





router.get("/newb", function(req, res){
   res.render('art.ejs'); 
    
});





/////////////PONIZEJ STARY SPOSOB////////////////////
/////////////////////////
router.post("/lala", middleware.isLoggedIn, upload.single('image'), function(req, res) { //moze byc ta sama sciezka jak przy app.get
 cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.campground.image = result.secure_url;
  // add author to campground
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  }
  plytyy.create(req.body.campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/index/' + campground.id);
  });
});
    
});

router.post('/art', function(req, res){
       var opis1 = req.body.opis1;
        var name1 = req.body.name1;
        var id = req.body._id;
        var createdAt = req.body.createdAt;
        var image1 = req.body.image1;
        var artNowy = {name1: name1, image1: image1, opis1: opis1, created: createdAt} ;
        art.create(artNowy, function(err, art){
           if(!err) {
           res.redirect('/index/'); }
        });
        
        // 5ac220f2d0fe6877ba309031
      //  5ac220f2d0fe6877ba309031
        
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render('new.ejs'); 
    
});




router.get("/:id", function(req, res){
    plytyy.findById(req.params.id).populate('comments').exec(function(err, foundPlyta){
        if(err){
            console.log(err);
        }//dodaje comments do\
    user.find({}).populate('author').exec(function (err, user) { //plytyy.find().where('author.id').equals(foundUser._id).sort({_id: -1}).exec(function(err, plyty){
        if(err) {                           // tego calego gowna comments dotyczy arraya w plyty.js
            console.log(err);
        }
        else {
            console.log(foundPlyta);
            res.render('show', {foundPlyta: foundPlyta, user: user});
        }

    });
});
});






router.get("/arty/:id", function(req, res){
    art.find({}).sort({_id: -1}).exec(function (err, moreArt) {
        if(err) {
            console.log(err);
        }
    art.findById(req.params.id, function(err, art){
        if(!err) {
       res.render('artykul', {
           art: art,
           moreArt: moreArt
       }); 
        }
    });
});
});

router.delete('/arty/:id', (req, res) =>{
    art.findByIdAndRemove(req.params.id, err =>{ 
        if(!err) {
            res.redirect('/index');
        }
    });
    //redirect gdzies
    
});





module.exports = router;