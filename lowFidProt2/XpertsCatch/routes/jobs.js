var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var streamBuffers = require('stream-buffers');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var uploads = multer({ dest: 'transfers/' });

/**********************************************************************
****************************mongoose-file STUFF*********************
***********************************************************************/
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;


var transfers_base = path.join(__dirname, "transfers");
var transfers = path.join(transfers_base, "u");

/**********************************************************************
**********************END OF mongoose-file STUFF***********************
***********************************************************************/









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
			res.render('jobs/edit', {'job':job, 'hiringManager_id':req.params.hiringManager_id});
		}
	});
});


router.post('/:job_id/details/:hiringManager_id/edit', uploads.single('description_file'), function(req, res){
console.log('inside job edit post\n');


	var hiringManagerId = req.params.hiringManager_id;
	var jobId           = req.params.job_id;
	
	var title       = req.body.title;
	var description = req.body.description;
	var company     = req.body.company;
	var location    = req.body.location;


	if(req.file){
		console.log("Uploading File: \n");
		console.log(req.file);

		var jobFileMeta = {} ;
		jobFileMeta["fileOriginalName"] = req.file.originalname;
		jobFileMeta["fileSize"] = req.file.size;
		jobFileMeta["fileMimetype"] = req.file.mimetype;
		jobFileMeta["fileName"] = req.file.filename;
		jobFileMeta["fileFieldName"] = req.file.fieldname;
		jobFileMeta["fileEncoding"] = req.file.encoding;
		jobFileMeta["fileDestination"] = req.file.destination;
		jobFileMeta["filePath"] = req.file.path;



		fs.readFile(req.file.path, function(err, original_data){
			if(err){
				console.log('hs readfile/jobs.js err: '+err);
				throw err;
			}

			console.log('read the uploaded file');
	
			var base64File = original_data.toString('base64');
			//Validate the Form
			req.checkBody('title', 'Job Title field is required').notEmpty();
 
			//store the errors for rendering
			var formErrors = req.validationErrors();    

			if(formErrors){
				res.render('jobs/edit',{errors : formErrors,title : title});
			} else {
				query = {_id: req.params.job_id};
				console.log('querying job:\n'+query);
				Job.findOneAndUpdate(
					query,
					{$set:
						{
				   			"title":title,
				   			"description": description,
				   			"company": company,
				   			"location": location,
							"fileData": base64File,
							"fileOriginalName": jobFileMeta["fileOriginalName"],
							"fileSize": jobFileMeta["fileSize"],
							"fileMimetype":jobFileMeta["fileMimetype"], 
							"fileName":jobFileMeta["fileName"],
							"fileFieldName":jobFileMeta["fileFieldNamem"],
							"fileEncoding":jobFileMeta["fileEncoding"],
							"fileDestination":jobFileMeta["fileDestination"],
							"filePath":jobFileMeta["filePath"]
				   		}
					},
					{safe: true, upsert: true},
					function(err, job){
						if(err){
							console.log('hs1 err: '+ err);
							throw err;}
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
									if(err){
										console.log('hs2 err: '+ err); 
										throw err;}
									else{
										console.log('updated job name for hiringManager:\n'+hiringManager+'\n\n');
									}
								}
							);
						}
					}	   
				);
			}
		}.bind( {jobFileMeta : jobFileMeta} ));

	} else {
		//store the errors for rendering
		var formErrors = req.validationErrors();    

		if(formErrors){
			res.render('jobs/edit',{errors : formErrors,title : title});
		} else {
			query = {_id: req.params.job_id};
			Job.findOneAndUpdate(
				query,
				{$set:
					{
			   			"title":title,
			   			"description": description,
			   			"company": company,
			   			"location": location
			   		}
				},
				{safe: true, upsert: true},
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
	}


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