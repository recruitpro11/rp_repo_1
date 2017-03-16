var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');

//hs middleware declarations
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');


/* This does not work with handlebars have to user express-flash instead 
var flash = require('connect-flash');*/
var flash = require('express-flash');


var mongo = require('mongodb');
var mongoose = require('mongoose');

var exphbs = require('express-handlebars');

var db = mongoose.connection;
mongoose.connect('mongodb://35.163.48.45/xpertscatch2');
mongoose.Promise = global.Promise
async = require('async'); 



/***************************************************************
***************************routes*******************************
****************************************************************/
//index is the main page user sees after login
var index = require('./routes/index');
//userse is where we put auth stuff register/ login etc.
var users = require('./routes/users');

//where our jobs are
var jobs = require('./routes/jobs');

//this is we put tA specific stuff 
var tAs = require('./routes/tAs');

//this is we put prof specific stuff 
var profs = require('./routes/profs');

//this is we put hiringManagers specific stuff 
var hiringManagers = require('./routes/hiringManagers');
/*****************************************************************
*****************************************************************/


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/********The cookie and max age must be here otherwise express flash wont work*************************/
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  //60000 60s cookie logs you out too fast
  cookie: { maxAge: 180000 }
}));

//ha passport must be after express session middleware
app.use(passport.initialize());
app.use(passport.session());

//hs validators we wanna have error handling here
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));




app.use(cookieParser());

//public folder is where we'll put all static pages
app.use(express.static(path.join(__dirname, 'public')));

//flash stuff
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});




/***************************************************************
*********Global Variable propagated through req.local***********
****************************************************************/
app.use(function (req, res, next) {
  if(req.url == '/'){
    res.locals.isHome = true;
  }
  next();
});

//knowing the current loged in user
//This makes the user objec global in all views
app.get('*',function(req, res, next){
  //put user into res.locals for easy access from templates
  res.locals.user = req.user || null;
  if(req.user != null){
    if(req.user.type == 'hiringManager'){
      res.locals.isTA = false;
      res.locals.isProf = false;
      res.locals.isHiringManager = true;
    } else if(req.user.type == 'prof'){
      res.locals.isTA = false;
      res.locals.isProf = true;
      res.locals.isHiringManager = false;
    } else{
      res.locals.isTA = true;
      res.locals.isProf = false;
      res.locals.isHiringManager = false;
    }
  }
  next();
});
/***************************************************************
***************************************************************/





/***************************************************************
***************************routes*******************************
****************************************************************/
app.use('/', index);
app.use('/users', users);
app.use('/jobs', jobs);
app.use('/tAs', tAs);
app.use('/profs', profs);
app.use('/hiringManagers', hiringManagers);
/*************************End of routes**************************
*****************************************************************/





/***************************************************************
***************************Error Handling***********************
****************************************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/*************************End of Error handling******************
*****************************************************************/

module.exports = app;
