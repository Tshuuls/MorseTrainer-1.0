

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const courses = require("./routes/courses");
const users = require("./routes/users");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/courses', courses.findAll);
app.get('/courses/:id', courses.findOne);
app.get('/courses/transform/:id', courses.transformOne);

app.post('/courses/create', courses.addCourse);
//{"coursetype":"letter","userId":2000001,"length":10}

//put -> change score
//delete -> delete course


app.get('/users', users.findAll);
app.get('/users/:id', users.findOne);
app.get('/users/score/:id', users.fullScore);
//get -> get course list

app.post('/users/add', users.addUser);
//{"name":"Percival Graves"}

//put -> change name



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
