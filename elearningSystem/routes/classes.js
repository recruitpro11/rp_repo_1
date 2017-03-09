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

module.exports = router;

