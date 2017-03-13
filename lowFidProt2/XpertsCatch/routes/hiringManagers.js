var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

//Schemas
Jobs = require('../models/job');
HiringManager = require('../models/hiringManager');



/*****************************************************************
***********************index Route***************************
******************************************************************/
router.get('/', ensureAuthenticated, function(req, res, next){
  res.render('hiringManagers/index');
});


/*****************************************************************
***********************Jobs Route***************************
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
//console.log('viewjob: hiringManager._id: '+hiringManager._id+'\nres.locals.user.id: '+res.locals.user.id+'\nres.user.id: '+req.user.id+'\nreq.user._id: '+req.user._id);
      res.render('hiringManagers/jobs', {'hiringManager': hiringManager});
    }
  });
});



/*****************************************************************
***********************Jobs ADD Route**************************
******************************************************************/
router.get('/jobs/:hiringManager_id/add', ensureAuthenticated, function(req, res, next) {
console.log('inside hiringManagers/jobs/'+ req.params.hiringManager_id +'/add GET\n');
//console.log('addjob: param: '+req.params.id+'\nuser.id: '+res.locals.user.id);
   res.render('hiringManagers/addjob', {hiringManager_id: req.params.hiringManager_id});
});

router.post('/jobs/:hiringManager_id/add', function(req, res){
console.log('inside hiringManagers/jobs/'+ req.params.hiringManager_id +'/add POST\n');

      var newJob = new Job({
        title : req.body.job_title,
        description : req.body.job_description,
        hiringManagers:[{hiringManager_id: req.params.hiringManager_id}]
      });
      console.log('hs created a job object to be added');

      newJob.save(function(err, job){
        if(err) throw err;
        console.log('created job:\n'+job+'\n\n');
  
        var query = {_id: mongoose.Types.ObjectId(req.params.hiringManager_id)};
        HiringManager.findOneAndUpdate(
                query,
                {$push: {"jobs": {job_id: job._id, job_title: req.body.job_title, job_description: req.body.job_description}}},
                {safe: true, upsert: true},
                //ALL CALLBACKS ARE OPTIONAL
                function(err, hiringManager){
                  console.log('updated hiringManager:\n'+hiringManager+'\n\n');
        });
      });

      req.flash('success','You have added a new job!');
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
