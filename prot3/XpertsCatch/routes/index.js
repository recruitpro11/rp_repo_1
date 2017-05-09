var express = require('express');
var router = express.Router();

//Job Schema
Job = require('../models/job');

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('isHiringManager: '+res.locals.isHiringManager);
	if(res.locals.isHiringManager){
    req.app.locals.layout =  'layout.handlebars';
		res.redirect('/hiringManagers/');
	} else if(res.locals.isTA){
    req.app.locals.layout =  'layout.handlebars';
		Job.getJobs(function(err, jobs){
    		if(err){
     	 	console.log(err);
     	 	res.send(err);
    		} else {
          res.redirect('/tAs/');
    		} 
  		});
	} else if(res.locals.isProf){
    Job.getJobs(function(err, jobs){
        if(err){
        console.log(err);
        res.send(err);
        } else {
          req.app.locals.layout =  'layout.handlebars';
          res.redirect('/profs/');
        } 
      });
  } else {
    req.app.locals.layout =  'landingLayout.handlebars';
    res.render('index', {'jobs': jobs});
     //res.render('index', {'jobs': jobs, defaultLayout: 'landingLayout.handlebars'});
     //res.render('index', {'jobs': jobs, layout: 'layout.handlebars'});
  }
});

module.exports = router;