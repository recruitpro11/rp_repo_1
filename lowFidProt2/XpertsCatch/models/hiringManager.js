var mongoose = require('mongoose');


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
                job_id:{type: [mongoose.Schema.Types.ObjectId]},
                job_title: {type:String}
        }]

});



//Module.expoerts will be available outside this file.
var HiringManager = module.exports = mongoose.model('HiringManager', HiringManagerSchema);

//Fetch a single instructor by its username
module.exports.getHiringManagerByUsername = function(username, callback){
  var query = {username: username};
  HiringManagers.findOne(query, callback);
}


//Register HiringManager for Class
/*module.exports.addJob = function(info, callback){
        hiringManager_username = info['hiringManager_username'];
        job_id = info['job_id'];
        job_title = info['job_title'];


        var query = {username: hiringManager_username};
        HiringManager.findOneAndUpdate(
                query,
                {$push: {"jobs": {job_id: job_id, job_title: job_title}}},
                {safe: true, upsert: true},
                callback
        );

}*/
