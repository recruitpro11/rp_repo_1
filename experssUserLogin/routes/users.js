var express = require('express');
var router = express.Router();

//user model=class
var User = require('../models/user.js');


/* GET localhost:3000/users */
router.get('/', function(req, res, next) {
  res.send('This is user routes root');
});


/* GET localhost:3000/users/register */
router.get('/register', function(req, res, next) {
  res.render('register', {
    'title':'Register'
  });
});

/* POST localhost:3000/users/login */
router.post('/register', function(req, res, next){

  //get form values.  req.body.name  === the name of the input in   input.form-control  in register.jade file 
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





module.exports = router;
