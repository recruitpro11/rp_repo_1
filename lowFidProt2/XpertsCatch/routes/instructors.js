var express = require('express');
var router = express.Router();

//Schemas
Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


router.get('/classes', ensureAuthenticated, function(req, res, next) {
console.log('Inside instructor /classes route');
  Instructor.getInstructorByUsername(req.user.username, function(err, instructor){
    if(err){
      console.log(err);
      res.send(err);
    } else {
console.log('retreived instructor\n');
console.log(instructor);
      res.render('instructors/classes', {'instructor': instructor});
    }
  });
});


router.post('/classes/register', function(req, res){
console.log('inside instructors/classes/register router');
        info = [];
        info['instructor_username'] = req.user.username;
        info['class_id'] = req.body.class_id;
        info['class_title'] = req.body.class_title;

        Instructor.register(info, function(err, instructor){
                if(err) throw err;
                console.log(instructor);
        });

        req.flash('success','You are now Registered to teach this class!');
        res.redirect('/instructors/classes');
});


router.get('/classes/:id/lessons/new', ensureAuthenticated, function(req, res, next) {
console.log('inside instructors/classes/'+req.params.id+'/lessons/new router');
   res.render('instructors/newlesson', {"class_id": req.params.id});
});

router.post('/classes/:id/lessons/new', ensureAuthenticated, function(req, res, next) {
   //Get form Values
   var info = [];
   info['class_id'] = req.params.id;
   info['lesson_number'] = req.body.lesson_number;
   info['lesson_title'] = req.body.lesson_title;
   info['lesson_body'] = req.body.lesson_body;

console.log('POST instructors/classes/'+req.params.id+'/lessons/new router: lesson to be added:\n');
console.log(info);


   Class.addLesson(info, function(err, lesson){
      console.log('Lesson Added');
   });

   req.flash('success','Lesson Added');
   res.redirect('/instructors/classes');
   
});



module.exports = router;
