var mongoose = require('mongoose');


//Instructors Schema
var InstructorsSchema = mongoose.Schema({
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
var Instructors = module.exports = mongoose.model('Instructors', InstructorsSchema);

//Fetch a single instructor by its username
module.exports.getInstructorByUsername = function(username, callback){
  var query = {username: username};
  Instructor.findOne(query, callback);
}


//Register Instructor for Class
module.exports.register = function(info, callback){
        instructor_username = info['instructor_username'];
        class_id = info['class_id'];
        class_title = info['class_title'];


        var query = {username: instructor_username};
        Instructor.findOneAndUpdate(
                query,
                {$push: {"classes": {class_id: class_id, class_title: class_title}}},
                {safe: true, upsert: true},
                callback
        );

}

