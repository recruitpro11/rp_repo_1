var express = require('express');
var router = express.Router();

//Schemas
Jobs = require('../models/job');
HiringManager = require('../models/hiringManager');

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

/******************************************************************
***********************Jobs Viwing Route***************************
******************************************************************/
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




/*****************************************************************
***********************Adding Jobs Route**************************
******************************************************************/
router.get('/:id/jobs/add', ensureAuthenticated, function(req, res, next) {
console.log('inside hiringManagers/'+ req.params.id +'/jobs/add GET');
   res.render('hiringManagers/addjob', {"job_id": req.params.id});
});

router.post('/:id/jobs/add', function(req, res){
  console.log('inside hiringManagers/'+ req.params.id +'/jobs/add POST');
      var newJob = new Job({
        title : req.body.job_title,
        description : req.body.job_description,
        hiringManagers:[{hiringManager_id:req.params.id}]
      });
console.log('hs created a job object hre');
      newJob.save(function(err, job){
        if(err) throw err;
        console.log(job);
      });

      req.flash('success','You have added a new job!');
      res.redirect('/hiringManagers/jobs');
});


module.exports = router;
