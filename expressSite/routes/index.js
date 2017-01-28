var express = require('express');
var router = express.Router();

/* GET home page.
 * This is a git request to the home page which is /
 * res.render  renders our jade file to the page.
 * In the json object parameter title should be set to the name of the 
 * .jade file in the view that you wanna put on this page. Also keep in midnd
 * that in the index.jade file youre displaying whatever this title is (that can * obviously be change)
 * **** Below is basically saying: Go to the given directoty (/) and run the given function
 */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('index',{title: 'Home'});
});

module.exports = router;
