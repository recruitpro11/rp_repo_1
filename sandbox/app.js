var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var handlebars = require('express-handlebars')
var logger = require('morgan');
var app = express();


/*
var sessionStore = new session.MemoryStore;




// View Engines
//app.set('view engine', 'jade');
app.engine('handlebars', handlebars()); app.set('view engine', 'handlebars');
//app.set('view engine', 'ejs');



app.use(logger('dev'));


app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));




app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
//    delete req.session.sessionFlash;
    next();
});





// Route that creates a flash message using the express-flash module
app.get('/express-flash', function( req, res ) {
    req.flash('success', 'This is a flash message using the express-flash module.');
    res.redirect(301, '/');
});

// Route that creates a flash message using custom middleware
app.get('/session-flash', function( req, res ) {
    req.session.sessionFlash = {
        type: 'success',
        message: 'This is a flash message using custom middleware and express-session.'
    }
    res.redirect(301, '/');
});

// Route that incorporates flash messages from either req.flash(type) or res.locals.flash
app.get('/', function( req, res ) {
    res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

*/




//var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('handlebars', handlebars()); app.set('view engine', 'handlebars');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//hs handles express sessions secret can be anything you want
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));



app.use(cookieParser());

//public folder is where we'll put all static pages
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.sessionFlash = req.session.sessionFlash;
  next();
});




/* GET home page. */
/*app.get('/', function(req, res, next) {
  req.flash('success', 'hsMessage');
  res.render('index');
});*/

// Route that creates a flash message using custom middleware
app.get('/a', function( req, res ) {
    req.session.sessionFlash = {
        type: 'success',
        message: 'This is a flash message using custom middleware and express-session.'
    }
 //   res.redirect('/');
      res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

// Route that incorporates flash messages from either req.flash(type) or res.locals.flash
app.get('/', function( req, res ) {
    res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

// Route that creates a flash message using the express-flash module
app.get('/b', function( req, res ) {
    req.flash('success', 'This is a flash message using the express-flash module.');
    //res.redirect('/');
      res.render('index');
});


module.exports = app;
