var express = require('express');
var router = express.Router();

//Class Schema
Class = require('../models/class');

/* GET home page. */
router.get('/', function(req, res, next) {
//  req.flash('success','hsMwss');
//  req.flash('info', 'Flash Message Added');
  Class.getClasses(function(err, classes){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('index', {'classes': classes});
    } 
  });
});

module.exports = router;
