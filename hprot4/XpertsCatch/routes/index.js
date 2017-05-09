var express = require('express');
var router = express.Router();

//Job Schema
Job = require('../models/job');

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('isHiringManager: '+res.locals.isHiringManager);
	if(res.locals.isHiringManager){
    req.app.locals.layout = 'layout';
		res.redirect('/hiringManagers/');
	} else if(res.locals.isTA){
		Job.getJobs(function(err, jobs){
    		if(err){
     	 	console.log(err);
     	 	res.send(err);
    		} else {
          req.app.locals.layout = 'layout';
          res.redirect('/tAs/');
    		} 
  		});
	} else if(res.locals.isProf){
    Job.getJobs(function(err, jobs){
        if(err){
        console.log(err);
        res.send(err);
        } else {
          req.app.locals.layout = 'layout';
          res.redirect('/profs/');
        } 
      });
  } else {
        Job.getJobs(function(err, jobs){
        if(err){
        console.log(err);
        res.send(err);
        } else {
          req.app.locals.layout = '';
          res.render('hs-dashboard');
        } 
      });
  }
});

module.exports = router;
