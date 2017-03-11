var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');
var Student = require('../models/student.js');
var Instructor= require('../models/instructor.js');

router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});


router.post('/signup', function(req, res, next){

console.log('hs route got request:\n');
console.log(req.body);



  //get form values. 
  var first_name = req.body.first_name;
  var last_name  = req.body.last_name;
  var email      = req.body.email;
  var username   = req.body.username;
  var password   = req.body.password;
  var password2  = req.body.password2;
  var type       = req.body.type;

console.log('\nhs route read type:');
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
console.log("hs route Errors\n");
cosole.log(errors);
     
      res.render('users/signup',{
      errors : errors,
      first_name : first_name,
      last_name : last_name,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2
    });
  } else {
    //Instantiate new user. Using User class which we define
    var newUser = new User({
      email : email,
      username: username,
      password: password,
      type: type
    });

console.log("hss route Created new User\n");
//cosole.log(newUser.first_name);

console.log("hs Compare res1\n");
console.log(type == 'Student');
console.log("hs Compare res2\n");
console.log(type === 'Student');

    if(type == 'student'){
      //Instantiate new Strudent
      var newStudent = new Student({
        first_name : first_name,
        last_name : last_name,
        email : email,
        username: username,
        password: password
      });

console.log("hs route Created new Student\n");
//cosole.log(newStudent.first_name);

      User.saveStudent(newUser, newStudent, function(err, user){
        console.log('New Student Created');
      });
    } else {
      //Instantiate new Instructor
      var newInstructor = new Instructor({
        first_name : first_name,
        last_name : last_name,
        email : email,
        username: username,
        password: password
      });
      User.saveInstructor(newUser, newInstructor, function(err, user){
        console.log('New Instructor Created');
      });
    }


    //Send a success flash message
    req.flash('success','You are now registered and may login');

    //redirect them to them homePage
    res.redirect('/');

  }


});


/**********************LOGIN STUFF******************************/
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
console.log('hs inside localStrategy');
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log("Unknown User")
        return done(null, false, {message: 'Unknown User'});
      }

console.log('hs found user:\n');
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


/* POST localhost:3000/users/login */
router.post('/login',passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req,res){
   console.log('Authentication Successful');
   req.flash('success','You are logged in');
   res.redirect('/classes');
});

/***************************End OF Login Stuff******************************/


/**********************LOGOUT STUFF******************************/
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
