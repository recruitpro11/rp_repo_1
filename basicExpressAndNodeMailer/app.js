//required packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

//setting up routes (ex path to the html that should be rendered o nthis page)** shows where they'r defined
var index = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');


//creating the express object
var app = express();

// view engine setup: in this case jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//The middle ware:
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//This says: we want the public folder to be where the static contents are put ((css files, js, images, etc)
app.use(express.static(path.join(__dirname, 'public')));


//**Define the routes we setup in above: Basically you're telling it that the link represented by /about in the .jade or html file is this user route here which is actually ./routes/users. This is basically aliasing
//If you're in home directory, call the index route variable
app.use('/', index);
app.use('/about',about);
app.use('/contact',contact);

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

module.exports = app;
