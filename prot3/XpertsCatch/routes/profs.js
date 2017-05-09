var express = require('express');
var router = express.Router();

//Schemas
Job = require('../models/job');
Prof = require('../models/prof');
User = require('../models/user');

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


router.get('/', ensureAuthenticated, function(req, res, next) {
  Prof.getProfByUsername(req.user.username, function(err, prof){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('profs/jobs', {'prof': prof});
    }
  });
});

router.get('/jobs', ensureAuthenticated, function(req, res, next) {
  Prof.getProfByUsername(req.user.username, function(err, prof){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('profs/jobs', {'prof': prof});
    }
  });
});


router.post('/jobs/register', function(req, res){
        info = [];
        info['prof_username'] = req.user.username;
        info['job_id'] = req.body.job_id;
        info['job_title'] = req.body.job_title;

        Prof.register(info, function(err, prof){
                if(err) throw err;
                console.log(prof);
        });
    
        req.flash('success','You are now Registered in this job!');
  
        res.redirect('/profs/jobs');
});

module.exports = router;
