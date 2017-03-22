var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');
var Prof = require('../models/prof.js');
var TA = require('../models/tA.js');
var HiringManager= require('../models/hiringManager.js');

router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});


/**************************************************************
**********************SIGNUP ROUTE******************************
***************************************************************/
router.post('/signup', function(req, res, next){

console.log('hs /signup route got request:\n');
console.log(req.body);



  //get form values. 
  var first_name = req.body.first_name;
  var last_name  = req.body.last_name;
  var email      = req.body.email;
  var username   = req.body.username;
  var password   = req.body.password;
  var password2  = req.body.password2;
  var type       = req.body.type;

  if(type == 'Hiring Manager'){
    type = 'hiringManager';
  }
  if(type == 'Professor'){
    type = 'prof';
  }
  if(type == 'Teacher Assistant'){
    type = 'tA';
  }

console.log('\nhs /signup route read type:');
console.log(type);

  //Validate the Form
  req.checkBody('first_name', 'First Name field is required').notEmpty();
  req.checkBody('last_name', 'Last Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


  //store the errors for rendering
  var errors = req.validationErrors();
  if(errors){
    console.log('hs err:\n' + errors);

    res.render('users/signup',{
      'errors' : errors,
      'first_name' : first_name,
      'last_name' : last_name,
      'email' : email,
      'username': username,
      'password': password,
      'password2': password2
    });
  } else {
    //Instantiate new user. Using User job which we define
    var newUser = new User({
      email : email,
      username: username,
      password: password,
      type: type
    });

console.log("hss route Created new User with type: "+ type);

    if(type == 'prof'){
      //Instantiate new Strudent
      var newProf = new Prof({
        first_name : first_name,
        last_name : last_name,
        email : email,
        username: username
      });

      User.saveProf(newUser, newProf, function(err, user){
        console.log('New Prof Created');
      });
    } else if(type == 'hiringManager') {
      //Instantiate new HiringManager
      var newHiringManager = new HiringManager({
        first_name : first_name,
        last_name : last_name,
        email : email,
        username: username
      });
      User.saveHiringManager(newUser, newHiringManager, function(err, user){
        console.log('New HiringManager Created');
      });
    } else {
      //Instantiate new Strudent
      var newTA = new TA({
        first_name : first_name,
        last_name : last_name,
        email : email,
        username: username
      });

      User.saveTA(newUser, newTA, function(err, user){
        console.log('New TA Created');
      });
    }


    req.flash('success','You are now registered and may login');
    res.redirect('/');
  }
});




/**************************************************************
**********************LOGIN AUTHENTICATION*********************
***************************************************************/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err,user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log("Unknown User")
        return done(null, false, {message: 'Unknown User'});
      }

console.log('hs LocalStrategy found user:\n');
console.log(user);

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          console.log("Invalid Password");
          return done(null, false, {message: 'Invalid Password'});
        }

      });
    });
  }
));


/**************************************************************
**********************LOGIN ROUTE******************************
***************************************************************/
/* POST localhost:3000/users/login */
router.post('/login',passport.authenticate('local', {failureRedirect:'/', failureFlash:'Invalid username or password'}), function(req,res){
   console.log('Authentication Successful');
   req.flash('success','You are logged in');
   res.redirect('/');
});



/**************************************************************
**********************LOGIN ROUTE******************************
***************************************************************/
router.get('/logout', function(req,res){
   req.logout();
   req.flash('success','You have logged out');
   res.redirect('/');
});

/***************************End OF Logout Stuff******************************/

/*********************USE THIS TO LOCK UNUTH PEOPLE OUT*********************/
/*EXAMPLE Locking out the registeration page.
router.get('/register', ensureAuthenticated, function(req, res, next) {
  res.render('register', { title: 'Register' });
});*/

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


module.exports = router;
