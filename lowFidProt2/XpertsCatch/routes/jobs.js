var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Job Schema
Job = require('../models/job');


/*****************************************************************
***********************index jobs Route***************************
******************************************************************/
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



/*****************************************************************
***********************Job Details Route***************************
******************************************************************/
/*GET dynamic url to desplay each job's details*/
//'path/:required/:optional?*'
router.get(['/:job_id/details/','/:job_id/details/:hiringManager_id'], function(req, res, next) {
console.log('hs3 /'+ req.params.job_id +'/details route');

  var isOwner = (req.params.hiringManager_id != null );

console.log(req.params.hiringManager_id);
console.log('isOwner: '+ isOwner);
  Job.getJobById(req.params.job_id, function(err, jobname){
    if(err){
      console.log(err);
      res.send(err);
    } else {
console.log('this is the job that was found\n')
console.log(jobname);
      res.render('jobs/details', {'job': jobname, 'isOwner': isOwner, 'hiringManager_id':req.params.hiringManager_id });
    }
  });
});



/*****************************************************************
***********************Edit job Route***************************
******************************************************************/
router.get('/:job_id/details/:hiringManager_id/edit', function(req, res, next) {
  Job.getJobById(req.params.job_id, function(err, job){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('jobs/edit', {'job':job});
    }
  });
});


router.post('/:job_id/details/edit', function(req, res){
console.log('inside job edit post');
  var query = {_id: req.params.job_id};
  Job.findOneAndUpdate(
    query,
    {$set: {"title":req.body.job_title, "description": req.body.job_description, "skills": req.body.job_skills}},
    {safe: true, upsert: true},
    //ALL CALLBACKS ARE OPTIONAL
    function(err, job){
      if(err) throw err;
      else{
        console.log('updated job:\n'+job+'\n\n');
     //  req.flash('success','You have updated this job!');
     //   res.redirect('/hiringManagers/jobs');
      }   
  });

  req.flash('success','You have updated this job!');
  res.redirect('/hiringManagers/jobs');
});








function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


module.exports = router;