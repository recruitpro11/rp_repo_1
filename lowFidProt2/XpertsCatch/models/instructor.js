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
  
        classes:[{
                 class_id:{type: [mongoose.Schema.Types.ObjectId]},
                 class_title: {type:String}
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
module.exports.register = function(info, callback){
        hiringManager_username = info['instructor_username'];
        class_id = info['class_id'];
        class_title = info['class_title'];


        var query = {username: hiringManager_username};
        Instructor.findOneAndUpdate(
                query,
                {$push: {"classes": {class_id: class_id, class_title: class_title}}},
                {safe: true, upsert: true},
                callback
        );

}

