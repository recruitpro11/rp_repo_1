var mongoose = require('mongoose');


//TA Schema
var TASchema = mongoose.Schema({
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
        }],
        referrals:[{
            applicant_id:{type: mongoose.Schema.Types.ObjectId},
            hiringManager_id:{type: mongoose.Schema.Types.ObjectId},
            job_id:{type: mongoose.Schema.Types.ObjectId}
        }]
});


var TA = module.exports = mongoose.model('TA', TASchema);

//Fetch a single tA by its username
module.exports.getTAByUsername = function(username, callback){
  var query = {username: username};
  TA.findOne(query, callback);
}


/*//Register TA for Class
module.exports.register = function(info, callback){
        tA_username = info['tA_username'];
        job_id = info['job_id'];
        job_title = info['job_title'];
        
        
        var query = {username: tA_username};
        TA.findOneAndUpdate(
                query,
                {$push: {"jobes": {job_id: job_id, job_title: job_title}}},
                {safe: true, upsert: true},
                callback
        );
        
}*/