var mongoose = require('mongoose');
var db = mongoose.connection;
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://35.163.48.45/elearn');

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



