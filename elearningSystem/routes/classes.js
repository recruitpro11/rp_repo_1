var express = require('express');
var router = express.Router();

//Class Schema
Class = require('../models/class');

/* GET classes home page. */
router.get('/', function(req, res, next) {
  Class.getClasses(function(err, classes){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/index', {'classes': classes});
    }
  });
});


/*GET dynamic url to desplay each class's details*/
router.get('/:id/details', function(req, res, next) {
  Class.getClassById(req.params.id, function(err, classname){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/details', {'class': classname});
    }
  });
});

module.exports = router;

