var express         = require('express'),
    app             = express(),
    override        = require('method-override'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    plytyy          = require('./models/plyty'),// sciezka do ustawien bazy danych
    seedDB          = require('./seeds'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    User            = require('./models/user'),
    Comment         = require('./models/comment'),
    flash           = require('connect-flash'),
    art            = require('./models/art'),
    moment          = require('moment')

        
var glownaRoute = require('./routes/plyty');
var commentRoute = require('./routes/comments');
var indexRoute = require('./routes/index');
var restRoute = require('./routes/rest');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(override("_method"));
mongoose.connect('mongodb://localhost/plyty_nowe2');
// mongoose.connect('mongodb://luki:luki@ds111370.mlab.com:11370/musicdb')
app.use(flash()); 
// seedDB();
//wylacz funkcje seedDB znajdująca się seeds.js
    
app.use(require('express-session')({
    secret: "tu moze byc cokolwiek nie wiem czemu",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); //laczy sie z post/login
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   res.locals.noMatch = req.flash('noMatch');
   res.locals.edit = req.flash('edit');
   app.locals.moment = require('moment');
   next();
});
app.use("/index/:id/comments", commentRoute); //sprawia, ze nie musssz pisac calej sciezki 
app.use("/index", glownaRoute); //podstawowe dodaj plyte "index" sprawia ze w sciezke nie musi byc /index
app.use(commentRoute); //komentarze
app.use(restRoute);
app.use(indexRoute); //register







// app.get('/index', function(req, res){
//     art.find({}, req.body.name, function(err, art){
        
//         if(err) {
//             console.log('errorrr');
//         }
//         else {
//             res.render('showart', {art: art});
//         }
        
//     });
//     // res.render('plyty', {albumy: albumy});

// });




app.listen(process.env.PORT, process.env.IP, function() {
    console.log('serveeeer ruszzyyyyllll');
});