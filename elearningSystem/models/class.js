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


//Add a new lesson to a Class
module.exports.addLesson = function(info, callback){
        class_id = info['class_id'];
        lesson_number = info['lesson_number'];
        lesson_title = info['lesson_title'];
        lesson_body = info['lesson_body'];
console.log('hs in models addLesson query:\n');

        var query = {_id: mongoose.Types.ObjectId(class_id)};
console.log(query);

        Class.findOneAndUpdate(
                query,
                {$push: {"lessons": {lesson_number: lesson_number, lesson_title: lesson_title, lesson_body: lesson_body}}},
                {safe: true, upsert: true},
                callback
        );

}
