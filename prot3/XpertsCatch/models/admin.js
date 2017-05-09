var mongoose = require('mongoose');

Jobs = require('../models/job');

//Admin Schema
var AdminSchema = mongoose.Schema({
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


var Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.getAdminByUsername = function(username, callback){
  var query = {username: username};
console.log(query );
  Admin.findOne(query, callback);
}


/*****************************************************************
***********************Adding Jobs *******************************
******************************************************************/

/*module.exports.addJob = function(adminInfo, , callback){
        admin_username = adminInfo['admin_username'];
        //job_title = adminInfo['job_title'];
        //job_description = adminInfofo['job_description'];

        module.exports.saveAdmin = function(newUser, newAdmin, callback){
console.log('hs users model saveAdmin');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newAdmin.save], callback);
        });
}



 /*       var query = {username: admin_username};
console.log(query)
        Admin.findOneAndUpdate(
                query,
                {$push: {"jobs": {job_title: job_title, job_description: job_description}}},
                {safe: true, upsert: true},
                callback
        );/*

       /* var newJob = new Job({
          title : job_title,
          description: job_description
        });*/

      //  async.parallel([newJob.save, Admin.findOneAndUpdate(query, {$push: {"jobs": {job_title: job_title, job_description: job_description}}}, {safe: true, upsert: true})], callback);
 //   console.log('got here');


//}*/

