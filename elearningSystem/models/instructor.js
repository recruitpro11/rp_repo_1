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

