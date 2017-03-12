var mongoose = require('mongoose');


//Student Schema
var StudentSchema = mongoose.Schema({
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


var Student = module.exports = mongoose.model('Student', StudentSchema);

//Fetch a single student by its username
module.exports.getStudentByUsername = function(username, callback){
  var query = {username: username};
  Student.findOne(query, callback);
}


//Register Student for Class
module.exports.register = function(info, callback){
        student_username = info['student_username'];
        class_id = info['class_id'];
        class_title = info['class_title'];
        
        
        var query = {username: student_username};
        Student.findOneAndUpdate(
                query,
                {$push: {"classes": {class_id: class_id, class_title: class_title}}},
                {safe: true, upsert: true},
                callback
        );
        
}
