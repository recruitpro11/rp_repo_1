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
Job = require('../models/job');
TA = require('../models/tA');
User = require('../models/user');








/*****************************************************************
**********************View TA jobs Route**************************
******************************************************************/
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







/*****************************************************************
**********************Applicants View Route***********************
******************************************************************/
router.get('/applicants', ensureAuthenticated, function(req, res, next) {
	TA.getTAByUsername(req.user.username, function(err, tA){
		if(err){
			console.log(err);
			res.send(err);
		} else {
			res.render('tAs/applicants', {'tA': tA});
		}
	});
});







/*****************************************************************
*********************Applicants ADD Route*************************
******************************************************************/
router.get('/applicants/:tA_id/add', ensureAuthenticated, function(req, res, next) {
	console.log('inside tAs/applicants/'+ req.params.tA_id +'/add GET\n');
	res.render('tAs/addApplicant', {tA_id: req.params.tA_id});
});

router.post('/applicants/:tA_id/add', uploads.single('resume_file'), function(req, res){
	console.log('inside tAs/applicants/'+ req.params.tA_id +'/add POST\n');
  
  
	var first_name  = req.body.first_name;
	var last_name   = req.body.last_name;
	var email       = req.body.email;
	var description = req.body.description;


	if(req.file){
		console.log("Uploading File: \n");
		console.log(req.file);

		var resumeFileMeta = {} ;
		resumeFileMeta["fileOriginalName"] = req.file.originalname;
		resumeFileMeta["fileSize"] = req.file.size;
		resumeFileMeta["fileMimetype"] = req.file.mimetype;
		resumeFileMeta["fileName"] = req.file.filename;
		resumeFileMeta["fileFieldName"] = req.file.fieldname;
		resumeFileMeta["fileEncoding"] = req.file.encoding;
		resumeFileMeta["fileDestination"] = req.file.destination;
		resumeFileMeta["filePath"] = req.file.path;


		fs.readFile(req.file.path, function(err, original_data){
			if(err){
				console.log('hs readfile in tAs.js err: '+err);
				throw err;
			}

			console.log('read the uploaded file');

			var base64File = original_data.toString('base64');

			//Validate the Form
			req.checkBody('first_name', 'First Name field is required').notEmpty();
			req.checkBody('last_name', 'Last Name field is required').notEmpty();
			req.checkBody('email', 'Email field is required').notEmpty();
			req.checkBody('email', 'Email not valid').isEmail();

			//store the errors for rendering
			var formErrors = req.validationErrors();    

			if(formErrors){
				res.render('tAs/addApplicant', {tA_id: req.params.tA_id, 'errors' : formErrors});
			} else {
				var newApplicant = new Applicant({
					first_name      : first_name,
	  				last_name       : last_name,
	  				email           : email,
	  				description     : description,
	  				referrers       : [{referrer_id: req.params.tA_id, hiringManager_first_name: req.user.username}],
	  				info            : [],
	  				skills          : [],
	  				hiringManagers  : [],
	  				jobs            : [],
	  				fileData        : base64File,
	  				fileOriginalName: resumeFileMeta["fileOriginalName"],
	  				fileSize		: resumeFileMeta["fileSize"],
	  				fileMimetype	: resumeFileMeta["fileMimetype"], 
	  				fileName        : resumeFileMeta["fileName"],
	  				fileFieldName   : resumeFileMeta["fileFieldNamem"],
	  				fileEncoding    : resumeFileMeta["fileEncoding"],
	  				fileDestination : resumeFileMeta["fileDestination"],
	  				filePath        : resumeFileMeta["filePath"]
	  			});
	  			console.log('hs created an applicant object to be added');

	  			newApplicant.save(function(err, applicant){
	  				if(err) throw err;
	  				else{
	  					console.log('created an Applicant:\n'+applicant+'\n\n');
	  					var query = {_id: mongoose.Types.ObjectId(req.params.tA_id)};
	  					TA.findOneAndUpdate(
	  						query,
	  						{$push: {"applicants": {applicant_id: applicant._id, applicant_first_name: applicant.first_name, applicant_last_name: applicant.last_name}}},
	  						{safe: true, upsert: true},
	  						//ALL CALLBACKS ARE OPTIONAL
	  						function(err, tA){
	  							console.log('updated tA:\n'+tA+'\n\n');
	  						}
	  					);
	  				}
	  			});
	  		}
	  	}.bind( {resumeFileMeta : resumeFileMeta} ));


	} else {
		req.checkBody('first_name', 'First Name field is required').notEmpty();
		req.checkBody('last_name', 'Last Name field is required').notEmpty();
		req.checkBody('email', 'Email field is required').notEmpty();
		req.checkBody('email', 'Email not valid').isEmail();

		//store the errors for rendering
		var formErrors = req.validationErrors();    

		if(formErrors){
			res.render('tAs/addApplicant', {tA_id: req.params.tA_id, 'errors' : formErrors});
		} else {
			var newApplicant = new Applicant({
				first_name      : first_name,
	  			last_name       : last_name,
	  			email           : email,
	  			description     : description,
	  			referrers       : [{referrer_id: req.params.tA_id, hiringManager_first_name: req.user.username}],
	  			info            : [],
	  			skills          : [],
	  			hiringManagers  : [],
	  			jobs            : []
	  		});
	  		console.log('hs created an applicant object to be added');

	  		newApplicant.save(function(err, applicant){
	  			if(err) throw err;
	  			else{
	  				console.log('created an Applicant:\n'+applicant+'\n\n');
	  				var query = {_id: mongoose.Types.ObjectId(req.params.tA_id)};
	  				TA.findOneAndUpdate(
	  					query,
	  					{$push: {"applicants": {applicant_id: applicant._id, applicant_first_name: applicant.first_name, applicant_last_name: applicant.last_name}}},
	  					{safe: true, upsert: true},
	  					//ALL CALLBACKS ARE OPTIONAL
	  					function(err, tA){
	  						console.log('updated tA:\n'+tA+'\n\n');
	  					}
	  				);
	  			}
	  		});
	  	}
	}


	req.flash('success','You have added a new Applicant!');
	res.redirect('/tAs/applicants');
});







function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
	return next();
  }
  res.redirect('/');
}

module.exports = router;
