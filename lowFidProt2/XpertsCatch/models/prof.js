var mongoose = require('mongoose');


//Prof Schema
var ProfSchema = mongoose.Schema({
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
                 job_id:{type: [mongoose.Schema.Types.ObjectId]},
                 job_title: {type:String}
        }]
});


var Prof = module.exports = mongoose.model('Prof', ProfSchema);

//Fetch a single prof by its username
module.exports.getProfByUsername = function(username, callback){
  var query = {username: username};
  Prof.findOne(query, callback);
}


//Register Prof for Class
/*module.exports.register = function(info, callback){
        prof_username = info['prof_username'];
        job_id = info['job_id'];
        job_title = info['job_title'];
        
        
        var query = {username: prof_username};
        Prof.findOneAndUpdate(
                query,
                {$push: {"jobes": {job_id: job_id, job_title: job_title}}},
                {safe: true, upsert: true},
                callback
        );
        
}*/
