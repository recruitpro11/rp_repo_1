var express = require('express');
var router = express.Router();

//Job Schema
Job = require('../models/job');

/* GET jobs home page. */
router.get('/', function(req, res, next) {
  Job.getJobs(function(err, jobs){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('jobs/index', {'jobs': jobs});
    }
  });
});


/*GET dynamic url to desplay each job's details*/
//'path/:required/:optional?*'
router.get('/:id/*:hiringManager_id?/details', function(req, res, next) {
console.log('hs3 /'+ req.params.id +'/details route');

  var isOwner = (req.params.hiringManager_id != null );
  Job.getJobById(req.params.id, function(err, jobname){
    if(err){
      console.log(err);
      res.send(err);
    } else {
console.log('this is the job that was found\n')
console.log(jobname);
      res.render('jobs/details', {'job': jobname, 'isOwner': isOwner});
    }
  });
});







/*router.get('/:id/lessons/:lesson_nb', ensureAuthenticated, function(req, res, next) {
   
  //get the job, and look through its lessons for the one 
  //we are looking for
  Job.getJobById(req.params.id, function(err, jobname){
console.log('hss got jobname:\n');
console.log(jobname);
    var lesson;
    if(err){
      console.log(err);
      res.send(err);
    } else {
      for(i=0; i<jobname.lessons.length; i++){
console.log('hss lesson:\n');
console.log(jobname.lessons[i]);
        if(jobname.lessons[i].lesson_number == req.params.lesson_nb){
console.log('hs found  the lesson we were looking for');
           lesson = jobname.lessons[i];
        }
      }
      res.render('jobs/lesson', {'job': jobname, "lesson":lesson });
    }
  });
});*/


function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


module.exports = router;
