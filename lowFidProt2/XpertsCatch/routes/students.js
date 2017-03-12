var express = require('express');
var router = express.Router();

//Schemas
Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


router.get('/classes', ensureAuthenticated, function(req, res, next) {
  Student.getStudentByUsername(req.user.username, function(err, student){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('students/classes', {'student': student});
    }
  });
});


router.post('/classes/register', function(req, res){
        info = [];
        info['student_username'] = req.user.username;
        info['class_id'] = req.body.class_id;
        info['class_title'] = req.body.class_title;

        Student.register(info, function(err, student){
                if(err) throw err;
                console.log(student);
        });
    
        req.flash('success','You are now Registered in this class!');
  
        res.redirect('/students/classes');
});

module.exports = router;
