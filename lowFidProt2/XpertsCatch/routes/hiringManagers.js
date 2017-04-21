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

//Schemas
Jobs = require('../models/job');
HiringManager = require('../models/hiringManager');
Applicant = require('../models/applicant');
Tecskill = require('../models/tecskill');







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
***********************Jobs ADD Route*****************************
******************************************************************/
router.get('/jobs/:hiringManager_id/add', ensureAuthenticated, function(req, res, next) {
console.log('inside hiringManagers/jobs/'+ req.params.hiringManager_id +'/add GET\n');

	Tecskill.find(function(err, skills){
		if(err){
			console.log('could not find the skillslist with er:\n');
	  		console.log(err);
	  	}
	  	
	  	res.render('hiringManagers/addjob', {hiringManager_id: req.params.hiringManager_id, skillsList: skills});
	});
});

router.post('/jobs/:hiringManager_id/add', uploads.single('description_file'), function(req, res){
console.log('inside hiringManagers/jobs/'+ req.params.hiringManager_id +'/add POST\n');
	
	
  	var title       	= req.body.title;
  	var description 	= req.body.description;
  	var company     	= req.body.company;
  	var location    	= req.body.location;
  	var hiringManagerId = req.params.hiringManager_id;

	
	var reqBody = req.body;
  	var skillsAr = [];

	Object.keys(reqBody).forEach(function(key) {
  		var val = reqBody[key];
  		if(val === 'on'){
  			//C++ must be stored as CPlusPlus
  			var fixedName = key.split("+").join("Plus");
  			skillsAr.push({skill_value: 1, skill_name: fixedName});
  		}
	});

	console.log('skillsAr:\n');
	console.log(skillsAr);
	console.log('\n');


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

			req.checkBody('title', 'Job Title field is required').notEmpty();
 
  			//store the errors for rendering
  			var formErrors = req.validationErrors();    

  			if(formErrors){
				res.render('hiringManagers/addjob', {hiringManager_id: req.params.hiringManagerId, 'errors' : formErrors});
  			} else {
  				var newJob = new Job({
  					title 			: title,
					description 	: description,
					company 		: company,
					location    	: location,
					hiringManagers  : [{hiringManager_id: req.params.hiringManager_id}],
					skills			: skillsAr,
					referers		: [],
					applicants		: [],
					fileData: base64File,
					fileOriginalName: jobFileMeta["fileOriginalName"],
					fileSize: jobFileMeta["fileSize"],
					fileMimetype:jobFileMeta["fileMimetype"], 
					fileName:jobFileMeta["fileName"],
					fileFieldName:jobFileMeta["fileFieldNamem"],
					fileEncoding:jobFileMeta["fileEncoding"],
					fileDestination:jobFileMeta["fileDestination"],
					filePath:jobFileMeta["filePath"]
				});
				console.log('hs created a job object to be added');

				newJob.save(function(err, job){
					if(err) throw err;
					else{
						console.log('created job:\n'+job+'\n\n');
						var query = {_id: mongoose.Types.ObjectId(req.params.hiringManager_id)};
						HiringManager.findOneAndUpdate(
							query,
							{$push: {"jobs": {job_id: job._id, job_title: job.title}}},
							{safe: true, upsert: true},
							//ALL CALLBACKS ARE OPTIONAL
							function(err, hiringManager){
								console.log('updated hiringManager:\n'+hiringManager+'\n\n');
							}
						);
					}
				});
			}

		}.bind( {jobFileMeta : jobFileMeta} ));


	} else {
		req.checkBody('title', 'Job Title field is required').notEmpty();
  			
  		//store the errors for rendering
  		var formErrors = req.validationErrors();    

  		if(formErrors){
			res.render('hiringManagers/addjob', {hiringManager_id: req.params.hiringManagerId, 'errors' : formErrors});
  		} else {
  			var newJob = new Job({
  				title 			: title,
				description 	: description,
				company 		: company,
				location    	: location,
				hiringManagers  : [{hiringManager_id: req.params.hiringManager_id}],
				skills			: skillsAr,
				referers		: [],
				applicants		: []
				});
			console.log('hs created a job object to be added');

			newJob.save(function(err, job){
				if(err) throw err;
				else{
					console.log('created job:\n'+job+'\n\n');
					var query = {_id: mongoose.Types.ObjectId(req.params.hiringManager_id)};
					HiringManager.findOneAndUpdate(
						query,
						{$push: {"jobs": {job_id: job._id, job_title: job.title}}},
						{safe: true, upsert: true},
						//ALL CALLBACKS ARE OPTIONAL
						function(err, hiringManager){
							console.log('updated hiringManager:\n'+hiringManager+'\n\n');
						}
					);
				}
			});
		}
	}

  	req.flash('success','You have added a new job!');
  	res.redirect('/hiringManagers/jobs');
});








/*****************************************************************
*******************View All Applicants Route**********************
******************************************************************/
router.get('/allApplicants', ensureAuthenticated, function(req, res, next) {
console.log('Inside hiringManager /allApplicants route');
  Applicant.find(function(err, applicants){
	if(err){
	  console.log(err);
	  res.send(err);
	} else {
	  res.render('hiringManagers/allApplicants', {'applicants': applicants});
	}
  });
});







/*****************************************************************
*************Add new skill Route************************
******************************************************************/
router.post('/jobs/:hiringManager_id/add/newskill',ensureAuthenticated, function(req, res, next) {

	var newSkillName = req.body.new_skill_name;
	console.log('new_skill_name: ' + newSkillName);
	var newTecskill = new Tecskill({
				skill_name  : newSkillName,
	  			skill_value : 1
	});

	newTecskill.save(function(err, skill){
		if(err){
	  		console.log('Error:\n'+err);
	  		res.send(err);
		} else {
	  		console.log('created skilllist:\n');
	  		console.log(skill);
	  		res.redirect('/tAs/applicants/'+ req.params.tA_id + '/add');
		}
	});
	console.log('hs created an applicant object to be added');
});









function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
	return next();
  }
  res.redirect('/');
}

module.exports = router;
