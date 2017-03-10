var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('hsDouble', { title: 'ejs' });
});

router.get('/d', function(req, res, next) {
  res.render('hsCirc', { title: 'ejs' });
});

router.get('/b', function(req, res, next) {
  res.render('arrowheads', { title: 'ejs' });
});

router.get('/a', function(req, res, next) {
  res.render('cLayout', { title: 'ejs' });
});


router.get('/c', function(req, res, next) {
  res.render('doubleCircle', { title: 'ejs' });
});

module.exports = router;
