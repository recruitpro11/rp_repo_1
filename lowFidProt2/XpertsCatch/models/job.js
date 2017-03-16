var mongoose = require('mongoose');
var path = require('path');

//job schema
var jobSchema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  file:{},
  fileData: {
    type: String
  },
  company: {
    type: String
  },
  location: {
    type: String
  },
  skills: [{
    skill_value: {type: Number},
    skill_name: {type: String},
    skill_social: {type: Number},
    skill_english: {type: Number}
  }],
  hiringManagers:[{
    hiringManager_id:{type: mongoose.Schema.Types.ObjectId},
    hiringManager_first_name: {type:String},
    hiringManager_last_name: {type:String},
  }],
  referers:[{
    referer_first_name: {type:String},
    referer_last_name: {type:String},
    referer_type: {type:String}
  }],
  applicants:[{
    applicant_first_name: {type:String},
    applicant_last_name: {type:String},
  }]
});



/**********************************************************************
****************************mongoose-file STUFF*********************
***********************************************************************/
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;


var transfers_base = path.join(__dirname, "transfers");
var transfers = path.join(transfers_base, "u");

jobSchema.plugin(filePlugin, {
  upload_to: make_upload_to_model(transfers, 'photos'),
  relative_to: transfers_base
});

/**********************************************************************
**********************END OF mongoose-file STUFF***********************
***********************************************************************/




//Make this schema available outside this file through a variable
var Job = module.exports = mongoose.model('Job', jobSchema);


//helper to Fetch all jobes from outside this file. Give a limit
//to the number of jobes that it returns
module.exports.getJobs = function(callback, limit){
  Job.find(callback).limit(limit);
}

//Fetch a single job by its id
module.exports.getJobById = function(id, callback){
console.log('inside getJobById');
  Job.findById(id, callback);
}