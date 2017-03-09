var mongoose = require('mongoose');



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

//Fetch a single class by its id
module.exports.getClassById = function(id, callback){
  Class.findById(id, callback);
}

