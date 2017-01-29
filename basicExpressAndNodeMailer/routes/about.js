var express = require('express');
var router = express.Router();

//'/' here is the root of the about. If below was inside index.js we'd put /about here
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'About' });
  res.render('about',{title: 'About'});
});

module.exports = router;
