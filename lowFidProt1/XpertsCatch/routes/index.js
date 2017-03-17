var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', /*ensureAuthenticated,*/ function(req, res, next) {
  res.render('index', { title: 'indexPage' });
});

function ensureAuthenticated(req, res, next){
  //this is passports authentication API
  if(req.isAuthenticated()){
//console.log(req.user);
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
