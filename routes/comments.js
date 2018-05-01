var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/plyty");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
   
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("newComment", {campground: campground});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/index");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.author.avatar = req.user.avatar;
              
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               
               res.redirect('/index/' + campground._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
          req.flash('edit', "Jesteś w trybie edycji");
        res.render("commentEdit", {campground_id: req.params.id, comment: foundComment, edit: req.flash('edit')});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          req.flash('success', "Komentarz został zmieniony");
          res.redirect("/index/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash('error', "Komentarz usunięty");
           res.redirect("/index/" + req.params.id);
       }
    });
});




module.exports = router;
