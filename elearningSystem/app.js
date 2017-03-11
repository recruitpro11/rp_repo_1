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
var multer = require('multer');


/* This does not work with handlebars have to user express-flash instead 
var flash = require('connect-flash');*/
var flash = require('express-flash');


var mongo = require('mongodb');
var mongoose = require('mongoose');

var exphbs = require('express-handlebars');

var db = mongoose.connection;
mongoose.connect('mongodb://35.163.48.45/elearn');
mongoose.Promise = global.Promise
async = require('async'); 



/***************************************************************
***************************routes*******************************
****************************************************************/
//index is the main page user sees after login
var index = require('./routes/index');
//userse is where we put auth stuff register/ login etc.
var users = require('./routes/users');
//where our classes are
var classes = require('./routes/classes');
//this is we put student specific stuff (ex classes)
var students = require('./routes/students');
//this is we put instrcutor specific stuff (ex classes)
var instructors = require('./routes/instructors');

/*****************************************************************
*****************************************************************/


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//hs handles file uploads
var multer = require('multer');
var upload = multer({ dest: './uploads' });


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
  cookie: { maxAge: 60000 }
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
  next();
});
/***************************************************************
***************************************************************/





/***************************************************************
***************************routes*******************************
****************************************************************/
app.use('/', index);
app.use('/users', users);
app.use('/classes', classes);
app.use('/students', students);
app.use('/instructors', instructors);
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
