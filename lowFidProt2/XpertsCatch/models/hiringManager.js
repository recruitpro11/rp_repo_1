var mongoose = require('mongoose');

Jobs = require('../models/job');

//HiringManager Schema
var HiringManagerSchema = mongoose.Schema({
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
            applicant_first_name: {type:String},
            applicant_last_name: {type:String},
        }],
        profs:[{
            profs_first_name: {type:String},
            profs_last_name: {type:String},
        }]

});


var HiringManager = module.exports = mongoose.model('HiringManager', HiringManagerSchema);

module.exports.getHiringManagerByUsername = function(username, callback){
  var query = {username: username};
console.log(query );
  HiringManager.findOne(query, callback);
}


/*****************************************************************
***********************Adding Jobs *******************************
******************************************************************/

/*module.exports.addJob = function(hiringManagerInfo, , callback){
        hiringManager_username = hiringManagerInfo['hiringManager_username'];
        //job_title = hiringManagerInfo['job_title'];
        //job_description = hiringManagerInfofo['job_description'];

        module.exports.saveHiringManager = function(newUser, newHiringManager, callback){
console.log('hs users model saveHiringManager');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newHiringManager.save], callback);
        });
}



 /*       var query = {username: hiringManager_username};
console.log(query)
        HiringManager.findOneAndUpdate(
                query,
                {$push: {"jobs": {job_title: job_title, job_description: job_description}}},
                {safe: true, upsert: true},
                callback
        );/*

       /* var newJob = new Job({
          title : job_title,
          description: job_description
        });*/

      //  async.parallel([newJob.save, HiringManager.findOneAndUpdate(query, {$push: {"jobs": {job_title: job_title, job_description: job_description}}}, {safe: true, upsert: true})], callback);
 //   console.log('got here');


//}*/

