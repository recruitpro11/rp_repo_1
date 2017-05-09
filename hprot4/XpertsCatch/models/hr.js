var mongoose = require('mongoose');

Jobs = require('../models/job');

//Hr Schema
var HrSchema = mongoose.Schema({
        first_name: {
                type: String,
        },

        last_name: {
                type: String,
        },

        email: {
                type: String
        },

        username: {
                type: String
        },
  
        jobs:[{
                job_id:{type: mongoose.Schema.Types.ObjectId},
                job_title: {type:String}
        }],
        applicants:[{
            applicant_id:{type: mongoose.Schema.Types.ObjectId},
            applicant_first_name: {type:String},
            applicant_last_name: {type:String},
        }],
        profs:[{
            prof_id:{type: mongoose.Schema.Types.ObjectId},
            prof_first_name: {type:String},
            prof_last_name: {type:String},
        }]

});


var Hr = module.exports = mongoose.model('Hr', HrSchema);

module.exports.getHrByUsername = function(username, callback){
  var query = {username: username};
console.log(query );
  Hr.findOne(query, callback);
}


/*****************************************************************
***********************Adding Jobs *******************************
******************************************************************/

/*module.exports.addJob = function(hrInfo, , callback){
        hr_username = hrInfo['hr_username'];
        //job_title = hrInfo['job_title'];
        //job_description = hrInfofo['job_description'];

        module.exports.saveHr = function(newUser, newHr, callback){
console.log('hs users model saveHr');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newHr.save], callback);
        });
}



 /*       var query = {username: hr_username};
console.log(query)
        Hr.findOneAndUpdate(
                query,
                {$push: {"jobs": {job_title: job_title, job_description: job_description}}},
                {safe: true, upsert: true},
                callback
        );/*

       /* var newJob = new Job({
          title : job_title,
          description: job_description
        });*/

      //  async.parallel([newJob.save, Hr.findOneAndUpdate(query, {$push: {"jobs": {job_title: job_title, job_description: job_description}}}, {safe: true, upsert: true})], callback);
 //   console.log('got here');


//}*/

