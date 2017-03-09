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
