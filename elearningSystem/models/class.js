var mongoose = require('mongoose');

mongoose.connect('mongodb://35.163.48.45/elearn');


//class schema
var classSchema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  instructor: {
    type: String
  },
  lessons: [{
    lesson_number: {type: Number},
    lesson_title: {type: String},
    lesson_body: {type: String}
  }]
});


//Make this schema available outside this file through a variable
var Class = module.exports = mongoose.model('Class', classSchema);

//helper to Fetch all classes from outside this file. Give a limit
//to the number of classes that it returns
module.exports.getClasses = function(callback, limit){
  Class.find(callback).limit(limit);
}
