var mongoose = require('mongoose');
var db = mongoose.connection;
//var bcrypt = require('bcrypt');

mongoose.connect('mongodb://35.163.48.45/xpertscatch');


//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:  true
	},

	password: {
		type: String
	},

	email: {
		type: String
	},

	name: {
		type: String
	},

	profileimage: {
		type: String
	}
});



//Make the User object available outside this file
var User = module.exports = mongoose.model('User', UserSchema);

//Start the functions you want this model to handle with module.exports
//so that they are availabel to us outside this file
module.exports.createUser = function(newUser, callback){
  //      bcrypt.hash(newUser.password,10,function(){}{});
	newUser.save(callback);
}
