var express = require('express');
var router = express.Router();

//Class Schema
Class = require('../models/class');

/* GET classes home page. */
router.get('/', function(req, res, next) {
  Class.getClasses(function(err, classes){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/index', {'classes': classes});
    }
  });
});


/*GET dynamic url to desplay each class's details*/
router.get('/:id/details', function(req, res, next) {
  Class.getClassById(req.params.id, function(err, classname){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/details', {'class': classname});
    }
  });
});


router.get('/:id/lessons', function(req, res, next) {
  Class.getClassById(req.params.id, function(err, classname){
    if(err){
      console.log(err);
      res.send(err);
    } else {
console.log('hs /'+ req.params.id +'/lessons route found class:\n');
console.log(classname);
      res.render('classes/lessons', {'class': classname});
    }
  });
});


router.get('/:id/lessons/:lesson_nb', ensureAuthenticated, function(req, res, next) {
   
  //get the class, and look through its lessons for the one 
  //we are looking for
  Class.getClassById(req.params.id, function(err, classname){
console.log('hss got classname:\n');
console.log(classname);
    var lesson;
    if(err){
      console.log(err);
      res.send(err);
    } else {
      for(i=0; i<classname.lessons.length; i++){
console.log('hss lesson:\n');
console.log(classname.lessons[i]);
        if(classname.lessons[i].lesson_number == req.params.lesson_nb){
console.log('hs found  the lesson we were looking for');
           lesson = classname.lessons[i];
        }
      }
      res.render('classes/lesson', {'class': classname, "lesson":lesson });
    }
  });
});


function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


module.exports = router;
