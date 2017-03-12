var express = require('express');
var router = express.Router();

//Schemas
Jobs = require('../models/job');
HiringManager = require('../models/hiringManager');
User = require('../models/user');

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


router.get('/jobs', ensureAuthenticated, function(req, res, next) {
console.log('Inside hiringManager /jobs route');
  HiringManager.getHiringManagerByUsername(req.user.username, function(err, hiringManager){
    if(err){
      req.flash('error','Did not find the HiringManager');
      console.log(err);
      res.send(err);
    } else {
console.log('retreived hiringManager\n');
console.log(hiringManager);
      res.render('hiringManagers/jobs', {'hiringManager': hiringManager});
    }
  });
});


router.post('/jobs/register', function(req, res){
console.log('inside hiringManagers/jobs/register router');
        info = [];
        info['hiringManager_username'] = req.user.username;
        info['job_id'] = req.body.job_id;
        info['job_title'] = req.body.job_title;

        HiringManager.register(info, function(err, hiringManager){
                if(err) throw err;
                console.log(hiringManager);
        });

        req.flash('success','You are now Registered to teach this job!');
        res.redirect('/hiringManagers/jobs');
});


router.get('/jobes/:id/lessons/new', ensureAuthenticated, function(req, res, next) {
console.log('inside hiringManagers/jobs/'+req.params.id+'/lessons/new router');
   res.render('hiringManagers/newlesson', {"job_id": req.params.id});
});

router.post('/jobes/:id/lessons/new', ensureAuthenticated, function(req, res, next) {
   //Get form Values
   var info = [];
   info['job_id'] = req.params.id;
   info['lesson_number'] = req.body.lesson_number;
   info['lesson_title'] = req.body.lesson_title;
   info['lesson_body'] = req.body.lesson_body;

console.log('POST hiringManagers/jobs/'+req.params.id+'/lessons/new router: lesson to be added:\n');
console.log(info);


   Jobs.addLesson(info, function(err, lesson){
      console.log('Lesson Added');
   });

   req.flash('success','Lesson Added');
   res.redirect('/hiringManagers/jobs');
   
});



module.exports = router;
