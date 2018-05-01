var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require("../middleware");
var plytyy = require('../models/plyty');
var comment = require('../models/user');
var noMatch = String;

//==============================
//tutaj sa sciezki rejestracji

router.get('/', function(req, res){
   res.render('home');
    
});


router.get('/register', function(req, res){
    req.flash('edit', "Podaj dane aby utworzyć konto");
  return res.render('register', {edit: req.flash('edit')});
    
});

//logika rejestracji

router.post('/register', function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
        
        
    });
     if(req.body.adminCode === 'secretcode123') {
         newUser.isAdmin = true;
     }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err);
            return res.render('register', {error: req.flash('error')});
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', "Zostałeś zarejestrowany jako " + user.username);
           res.redirect('/index'); 
        });
    });
    
});

//pokazuje login route

router.get('/login', function(req, res){
    res.render('login');
});

router.post
('/login', passport.authenticate('local', 
{ 
    successRedirect: '/index',
    failureRedirect: "/login"
    
    
}), function(req, res){
    //to nic nie robi w sumie
});
//logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "Wylogowałeś się");
    res.redirect('/index');
    
});

//profil uzytkownika

router.get('/users/:id', function(req, res){
   User.findById(req.params.id, function(err, foundUser){
      if(!err) {
          plytyy.find().where('author.id').equals(foundUser._id).sort({_id: -1}).exec(function(err, plyty){
              if(err) {
                  console.log(err);
              }
              comment.find().where('author.id').equals(foundUser._id).exec(function(err, comment) {
        
              if(err){
                  console.log(err);
              }
              res.render('users/show', {user: foundUser, plyty: plyty, comment: comment});
          });
      });
      }
   });
});
router.get('/users/:id/edit',  function(req, res){
     User.findById(req.params.id, function(err, user){
        if(err) {
            console.log(err);
        }
        else {
            req.flash('edit', "Jesteś w trybie edycji");
         return res.render('users/editt.ejs', {user: user, edit: req.flash('edit')});
        }
        
    });
    
});

router.put("/users/:id", function(req, res){
   User.findByIdAndUpdate(req.params.id, req.body.dane, function(err, updatedComment){
      if(err){
          console.log('errror')
      } else {
          req.flash('success', "Twoje dane zostały zaktualizowane");
          res.redirect("/users/" + req.params.id );
      }
   });
});

// router.get('/record', function(req, res){
//     if(req.query.search) {
//         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//         // Get all campgrounds from DB
//         plytyy.find({name: regex}, function(err, allCampgrounds){
//           if(err){
//               console.log(err);
//           } else {
//               if(allCampgrounds.length === 0) {
//                   req.flash('error', 'Nie znaleziono wyników');
//                     return res.redirect('/record');
                  
//               } else {
//               req.flash('success', 'znaleziono: ');
//               return res.render("allRecord", {oneRecord:allCampgrounds});
//               }
//           }
//         });
//     } else {
//       plytyy.find({}).sort({_id: -1}).exec(function (err, oneRecord) {
//          if(!err) {
            
//              res.render('allRecord', {oneRecord: oneRecord})
//             }
            
//       });
//     }
// });

router.get("/record", function(req, res){
    var perPage = 9;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        plytyy.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            plytyy.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        req.flash('error', 'Nie znaleziono wyników');
                     return res.redirect('/record');
                    }
                    
                    res.render("allRecord", {
                        oneRecord: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        plytyy.find({}).sort({_id: -1}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, oneRecord) {
            plytyy.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("allRecord", {
                        oneRecord: oneRecord,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;