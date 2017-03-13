var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//mongo Schemas
Job = require('../models/job');
HiringManager = require('../models/hiringManager');


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
	  res.render('jobs/edit', {'job':job, 'hiringManager_id': req.params.hiringManager_id});
	}
  });
});


router.post('/:job_id/details/:hiringManager_id/edit', function(req, res){
console.log('inside job edit post');

	var hiringManagerId = req.params.hiringManager_id;
  	var jobId           = req.params.job_id;
  	
  	var title       = req.body.title;
  	var description = req.body.description;
  	var company     = req.body.company;
  	var location    = req.body.location;

	if(req.files && req.files.description_file){
		console.log("Uploading File...");

		//file info
		var descriptionFileOriginalName = req.files.description_file.originalname;
		var descriptionFileName         = req.files.description_file.name
		var descriptionFileMime         = req.files.description_file.mimetype;
		var descriptionFilePath         = req.files.description_file.path
		var descriptionFileExtension    = req.files.description_file.extension;
		var descriptionFileSize         = req.files.description_file.size
	} else {
		// Set a default profile image. We put this in the uploads folder ourselves
		var descriptionFileName = 'noImage.png';
  	}


  	//Validate the Form
  	req.checkBody('title', 'Job Title field is required').notEmpty();
 
  	//store the errors for rendering
  	var formErrors = req.validationErrors();    

  	if(formErrors){
		res.render('jobs/edit',{errors : formErrors,title : title});
  	} else {
  		query = {_id: req.params.job_id};
		Job.findOneAndUpdate(
			query,
			{$set:{
				   "title":title,
				   "description": description,
				   "company": company,
				   "location": location,
				   "descriptionFile" : descriptionFileOriginalName
				   }
			},
			{safe: true, upsert: true},
			//ALL CALLBACKS ARE OPTIONAL
			function(err, job){
	  			if(err) throw err;
	  			else{
					console.log('updated job:\n'+job+'\n\n');
        			HiringManager.update(
        				{
        					//select a doc: can also use <_id: hiringManagerId>
        					"jobs.job_id": jobId,
        					//select a job
        					jobs: { $elemMatch:{job_id: jobId} }
        				},
        				{ 
        					$set:{"jobs.$.job_title": title}
        				},
        				function(err, hiringManager){
        					if(err) throw err;
        					else{
        						console.log('updated job name for hiringManager:\n'+hiringManager+'\n\n');
        					}
        				}
        			);
	  			}
	  		}   
 		);
  	}

  	       			/*
					var query = {_id: mongoose.Types.ObjectId(req.params.hiringManager_id)};
        			HiringManager.findOneAndUpdate(
               			query,
                		{$push: {"jobs": {job_id: job._id, job_title: req.body.job_title, job_description: req.body.job_description}}},
                		{safe: true, upsert: true},
                		//ALL CALLBACKS ARE OPTIONAL
                		function(err, hiringManager){
                  			console.log('updated hiringManager:\n'+hiringManager+'\n\n');
        			});
        			*/
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