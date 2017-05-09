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

//Add a hiringManager
module.exports.saveHiringManager = function(newUser, newHiringManager, callback){
console.log('hs users model saveHiringManager');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newHiringManager.save], callback);
        });
}

//Add an Professor 
module.exports.saveProf = function(newUser, newProf, callback){
console.log('hs users model saveProf');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newProf.save], callback);
        });
}

//Add an TeachersAssitant
module.exports.saveTA = function(newUser, newTa, callback){
console.log('hs users model saveTa');
   bcrypt.hash(newUser.password,10,function(err, hash){
          if(err) throw err;
          //set hashed pw
          newUser.password = hash
          //make several updates in parallel: put the newUser in users and newStudent in students
          async.parallel([newUser.save, newTa.save], callback);
        });
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) return callback(err);
    callback(null, isMatch);
  });
}

