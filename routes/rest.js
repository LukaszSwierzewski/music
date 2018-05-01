var express = require('express');
var router = express.Router();
var plytyy = require('../models/plyty');
var middleware = require('../middleware');
router.get('/index/:id/edit', middleware.checkCampgroundOwnership,  function(req, res){
     plytyy.findById(req.params.id, function(err, plytyy){
        if(err) {
            console.log(err);
        }
        else {
            req.flash('edit', "Jesteś w trybie edycji");
         return res.render('edit', {plytyy: plytyy, edit: req.flash('edit')});
        }
        
    });
    
});



router.put('/index/:id', middleware.checkCampgroundOwnership, function(req, res){
   plytyy.findByIdAndUpdate(req.params.id, req.body.plytyy, function(err, upBlog){ //REQ BODY PLYTYY BARDZO WAZNE KURWAAAAAAAAAA
                                                                                //PATRZ W NAME W index/edit
       if(!err) {
        req.flash('success', "Post został zmieniony");
     res.redirect('/index/'+ req.params.id);
     return {success: req.flash('success')}
       }
   });
    
    
});

router.delete('/index/:id',middleware.checkCampgroundOwnership, function(req, res){
    //zniszcz blog
    plytyy.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect('/index');
        }
        else {
            res.redirect('/index');
        }
    });
    //redirect gdzies
    
});







module.exports = router;