var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//user model=class
var User = require('../models/user.js');


/* GET localhost:3000/users */
router.get('/', function(req, res, next) {
  res.send('This is user routes root');
});




/* GET localhost:3000/users/register */
//router.get('/register', function(req, res, next) {
//  res.render('register', {
//    'title':'Register'
//  });
//});

//Locking out the registeration page for now. Later uncomment
//above and remove below
/* GET home page. */
router.get('/register', ensureAuthenticated, function(req, res, next) {
  res.render('register', { title: 'Register' });
});

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}




/* GET localhost:3000/users/register/prof */
router.get('/register/prof', function(req, res, next) {
  res.render('profRegForm', {
    'title':'profReg'
  });
});

/* GET localhost:3000/users/register/ta */
router.get('/register/ta', function(req, res, next) {
  res.render('taRegForm', {
    'title':'taReg'
  });
});

/* GET localhost:3000/users/register/hm */
router.get('/register/hm', function(req, res, next) {
  res.render('hmRegForm', {
    'title':'hmReg'
  });
});


/* POST localhost:3000/users/register/prof*/
router.post('/register/prof', function(req, res, next){

  //get form values.  req.body.name  === the name of the input in   input.form-control  in register.jade file 
  var formOccupation = "prof";
  var formName = req.body.name;
  var formEmail = req.body.email;
  var formUsername = req.body.username;
  var formPassword = req.body.password;
  var formPassword2 = req.body.password2;
   
//console.log("this is req:\n")
//console.log(req.body)
//console.log("\n\n")
 
  //Check for Image Field
  if(req.files && req.files.profileimage){

    console.log("Uploading File...");

    //file info
    var formProfileImageOriginalName = req.files.profileimage.originalname;
    var formProfileImageName         = req.files.profileimage.name
    var formProfileImageMime         = req.files.profileimage.mimetype;
    var formProfileImagePath         = req.files.profileimage.path
    var formProfileImageExtension    = req.files.profileimage.extension;
    var formProfileImageSize         = req.files.profileimage.size
  } else {
    // Set a default profile image. We put this in the uploads folder ourselves
    var formProfileImageName = 'noImage.png';
  }

 
  //Validate the Form
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

 
  //store the errors for rendering
  var formErrors = req.validationErrors();
//console.log(formErrors) 
  if(formErrors){

    res.render('register',{
      errors : formErrors,
      name : formName,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2
    });
  } else {

    //Instantiate new user. Using User class which we define
    var newUser = new User({
      occupation: formOccupation,
      name : formName,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2,
      profileimage: formProfileImageName
    });

//console.log("this is new user: \n")
//console.log(newUser)

    //Create user
    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log(user);
    });

    //Send a success flash message
    req.flash('success','You are now registered and may login');

    //redirect them to them homePage 
    res.location('/');
    res.redirect('/');
 
  }
 

});



/* POST localhost:3000/users/register/ta */
router.post('/register/ta', function(req, res, next){

  //get form values.  req.body.name  === the name of the input in   input.form-control  in register.jade file
  var formOccupation = "ta";
  var formName = req.body.name;
  var formEmail = req.body.email;
  var formUsername = req.body.username;
  var formPassword = req.body.password;
  var formPassword2 = req.body.password2;

//console.log("this is req:\n")
//console.log(req.body)
//console.log("\n\n")

  //Check for Image Field
  if(req.files && req.files.profileimage){

    console.log("Uploading File...");

    //file info
    var formProfileImageOriginalName = req.files.profileimage.originalname;
    var formProfileImageName         = req.files.profileimage.name
    var formProfileImageMime         = req.files.profileimage.mimetype;
    var formProfileImagePath         = req.files.profileimage.path
    var formProfileImageExtension    = req.files.profileimage.extension;
    var formProfileImageSize         = req.files.profileimage.size
  } else {
    // Set a default profile image. We put this in the uploads folder ourselves
    var formProfileImageName = 'noImage.png';
  }


  //Validate the Form
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


  //store the errors for rendering
  var formErrors = req.validationErrors();
//console.log(formErrors)
  if(formErrors){

    res.render('register',{
      errors : formErrors,
      name : formName,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2
    });
  } else {
    //Instantiate new user. Using User class which we define
    var newUser = new User({
      occupation: formOccupation,
      name : formName,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2,
      profileimage: formProfileImageName
    });

//console.log("this is new user: \n")
//console.log(newUser)

    //Create user
    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log(user);
    });

    //Send a success flash message
    req.flash('success','You are now registered and may login');

    //redirect them to them homePage
    res.location('/');
    res.redirect('/');

  }


});



/* POST localhost:3000/users/register/hm */
router.post('/register/hm', function(req, res, next){

  //get form values.  req.body.name  === the name of the input in   input.form-control  in register.jade file
  var formOccupation = "hm";
  var formName = req.body.name;
  var formEmail = req.body.email;
  var formUsername = req.body.username;
  var formPassword = req.body.password;
  var formPassword2 = req.body.password2;

//console.log("this is req:\n")
//console.log(req.body)
//console.log("\n\n")

  //Check for Image Field
  if(req.files && req.files.profileimage){

    console.log("Uploading File...");

    //file info
    var formProfileImageOriginalName = req.files.profileimage.originalname;
    var formProfileImageName         = req.files.profileimage.name
    var formProfileImageMime         = req.files.profileimage.mimetype;
    var formProfileImagePath         = req.files.profileimage.path
    var formProfileImageExtension    = req.files.profileimage.extension;
    var formProfileImageSize         = req.files.profileimage.size
  } else {
    // Set a default profile image. We put this in the uploads folder ourselves
    var formProfileImageName = 'noImage.png';
  }


  //Validate the Form
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


  //store the errors for rendering
  var formErrors = req.validationErrors();
//console.log(formErrors)
  if(formErrors){

    res.render('register',{
      errors : formErrors,
      name : formName,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2
    });
  } else {
    //Instantiate new user. Using User class which we define
    var newUser = new User({
      occupation: formOccupation,
      name : formName,
      email : formEmail,
      username: formUsername,
      password: formPassword,
      password2: formPassword2,
      profileimage: formProfileImageName
    });

//console.log("this is new user: \n")
//console.log(newUser)

    //Create user
    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log(user);
    });

    //Send a success flash message
    req.flash('success','You are now registered and may login');

    //redirect them to them homePage
    res.location('/');
    res.redirect('/');

  }


});




/* GET localhost:3000/users/login */
router.get('/login', function(req, res, next) {
  res.render('login', {
    'title':'Login'
  });
});



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
   res.redirect('/');
});


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});

module.exports = router;
