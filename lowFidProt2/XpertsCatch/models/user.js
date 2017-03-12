var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


//User Schema
var UserSchema = mongoose.Schema({
        username: {
                type: String,
                index:  true
        },

        password: {
                type: String,
                required: true,
                bcrypt: true
        },

        email: {
                type: String
        },
  
        type: {
                type: String
        }

});



//Make the User object available outside this file. Anthing with
//Module.expoerts will be available outside this file.
var User = module.exports = mongoose.model('User', UserSchema);


//Fetch a single user by its id
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

//Fetch a single user by its username
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

//Add a student
module.exports.saveStudent = function(newUser, newStudent, callback){
console.log('hs users model saveStudent');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newStudent.save], callback);
        });
}

//Add an Instuctor 
module.exports.saveInstructor = function(newUser, newInstructor, callback){
console.log('hs users model saveInstructor');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newInstructor.save], callback);
        });
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) return callback(err);
    callback(null, isMatch);
  });
}

