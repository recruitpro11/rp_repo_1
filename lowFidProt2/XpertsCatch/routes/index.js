var express = require('express');
var router = express.Router();

//Job Schema
Job = require('../models/job');

/* GET home page. */
router.get('/', function(req, res, next) {
console.log('isHiringManager: '+res.locals.isHiringManager);
	if(res.locals.isHiringManager){
		res.redirect('/hiringManagers/');
	} else{
		Job.getJobs(function(err, jobs){
    		if(err){
     	 	console.log(err);
     	 	res.send(err);
    		} else {
     	 		res.render('index', {'jobs': jobs});
    		} 
  		});
	}
});

module.exports = router;