var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
// Packages to make flash messages
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var path = require('path');

var app = express();

// Requiring the index where all the routes are
var routes = require('./routes/index');

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
// Let us use static files
app.use(express.static('public'));

/*
===============================
=========MIDDLEWARE===========
==============================*/

// Connect-flash middleware
app.use(flash());

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  next();
});

// Express validator middleware
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

// BodyParser Middelware
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());

/*==================================
===========END Middleware==========
=================================*/

app.use('/', routes);

// Run the server
var port = 3000;
app.listen(port, () => {
    console.log('App is running on '+port)
});