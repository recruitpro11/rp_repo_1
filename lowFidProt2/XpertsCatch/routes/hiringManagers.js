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
//console.log('addjob: param: '+req.params.id+'\nuser.id: '+res.locals.user.id);
   res.render('hiringManagers/addjob', {hiringManager_id: req.params.hiringManager_id});
});

router.post('/jobs/:hiringManager_id/add', uploads.single('description_file'), function(req, res){
console.log('inside hiringManagers/jobs/'+ req.params.hiringManager_id +'/add POST\n');
	
	
  	var title       	= req.body.title;
  	var description 	= req.body.description;
  	var company     	= req.body.company;
  	var location    	= req.body.location;
  	var hiringManagerId = req.params.hiringManager_id;


/**********retrieving skills**************/
  	/*var cheerio = require('cheerio'),
		$ = cheerio.load('file.html'),
		fs = require('fs');

	fs.readFile('./views/tAs/addApplicant.handlebars', function (err, hbs) {
		if (err) {
			throw err; 
		} else {
			$ = cheerio.load(hbs.toString());
			console.log("hsObj:\n" + $('#list1'));   
		}
	});*/

	var s1 = req.body.s1;
	var s2 = req.body.s2;
	var s3 = req.body.s3;
	var s4 = req.body.s4;
	var s5 = req.body.s5;
	if(s1 == 'on'){
		s1 = 1;
	} else {
		s1 = 0;
	}
	if(s2 == 'on'){
		s2 = 1;
	} else {
		s2 = 0;
	}
	if(s3 == 'on'){
		s3 = 1;
	} else {
		s3 = 0;
	}
	if(s4 == 'on'){
		s4 = 1;
	} else {
		s4 = 0;
	}
	if(s5 == 'on'){
		s5 = 1;
	} else {
		s5 = 0;
	}


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
					skills			: [{skill_value: s1, skill_name: 'Php'}, {skill_value: s2, skill_name: 'Java'}, {skill_value: s3, skill_name: 'C++'}, {skill_value: s4, skill_name: 'Node'}, {skill_value: s5, skill_name: 'Language'}],
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
				skills			: [{skill_value: s1, skill_name: 'Php'}, {skill_value: s2, skill_name: 'Java'}, {skill_value: s3, skill_name: 'C++'}, {skill_value: s4, skill_name: 'Node'}, {skill_value: s5, skill_name: 'Language'}],
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







function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
	return next();
  }
  res.redirect('/');
}

module.exports = router;
