var mongoose = require('mongoose');



//job schema
var jobSchema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  //need npm install mongoose-file for this
  //descriptionFile: {
    //type: File
  //},
  descriptionFile: {
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


//Make this schema available outside this file through a variable
var Job = module.exports = mongoose.model('Job', jobSchema);

/*module.exports.createJob = function(newJob, callback){
        bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //put user in db
          
        });
}*/


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


/*
module.exports.addjob(info, callback(err, job){


//Add a new lesson to a Job
/module.exports.addLesson = function(info, callback){
        job_id = info['job_id'];
        lesson_number = info['lesson_number'];
        lesson_title = info['lesson_title'];
        lesson_body = info['lesson_body'];
console.log('hs in models addLesson query:\n');

        var query = {_id: mongoose.Types.ObjectId(job_id)};
console.log(query);

        Job.findOneAndUpdate(
                query,
                {$push: {"lessons": {lesson_number: lesson_number, lesson_title: lesson_title, lesson_body: lesson_body}}},
                {safe: true, upsert: true},
                callback
        );

}*/
