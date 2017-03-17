var express = require('express');
var router = express.Router();

//Schemas
Job = require('../models/job');
TA = require('../models/tA');
User = require('../models/user');

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


router.get('/jobs', ensureAuthenticated, function(req, res, next) {
  TA.getTAByUsername(req.user.username, function(err, tA){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('tAs/jobs', {'tA': tA});
    }
  });
});


router.post('/jobs/register', function(req, res){
        info = [];
        info['tA_username'] = req.user.username;
        info['job_id'] = req.body.job_id;
        info['job_title'] = req.body.job_title;

        TA.register(info, function(err, tA){
                if(err) throw err;
                console.log(tA);
        });
    
        req.flash('success','You are now Registered in this job!');
  
        res.redirect('/tAs/jobs');
});

module.exports = router;
