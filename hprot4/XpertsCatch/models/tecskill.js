var mongoose = require('mongoose');



//allskills schema
var tecskillSchema = mongoose.Schema({
	skill_name: {type: String},
    skill_value: {type: Number}
});


//Make this schema available outside this file through a variable
var Tecskill = module.exports = mongoose.model('Tecskill', tecskillSchema);