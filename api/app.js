var createError = require('http-errors');
var express = require('express');
require('dotenv').config();

const cors = require('cors');
const indexRouter = require('./routes/index');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); 


var app = express();
const originWhitelist = new Set([
  'https://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      if (!origin) return callback(null, true);
      if (!originWhitelist.has(origin)) {
        const message = `The CORS policy for this origin doesn't allow access from the particular origin.`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 app.use("/", indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
