var mongoose = require('mongoose');



//applicant schema
var applicantSchema = mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String
  },
  referers:[{
    referer_first_name: {type:String},
    referer_last_name: {type:String},
    referer_type: {type:String}
  }],
  jobs:[{
    job_title: {type:String}
  }],
  skills: [{
    skill_value: {type: Number},
    skill_name: {type: String}
  }],
  info: [{
    location: {type: String},
    school: {type: String}
  }]
});


//Make this schema available outside this file through a variable
var Applicant = module.exports = mongoose.model('Applicant', applicantSchema);

//helper to Fetch all jobes from outside this file. Give a limit
//to the number of jobes that it returns
module.exports.getApplicants = function(callback, limit){
  Job.find(callback).limit(limit);
}

//Fetch a single job by its id
module.exports.getApplicantById = function(id, callback){
  Job.findById(id, callback);
}


//Add a new lesson to a Job
/*module.exports.addLesson = function(info, callback){
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
