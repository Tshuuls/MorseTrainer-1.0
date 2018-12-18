

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

//app.use(logger('dev'));
if (process.env.NODE_ENV |= 'test') {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/courses', courses.findAll);
app.get('/courses/:id', courses.findOne);
app.get('/courses/transformation/:id', courses.transformOne);

app.post('/courses', courses.addCourse);
//{"coursetype":"morse","userId":"5bcc64f129ebe7f8da21df18","length":3}  Percival
//{"coursetype":"letter","userId":"5bcc64fd29ebe7f8da21df19","length":7}  Matt

app.put('/courses/:id',courses.updateScore);

app.delete('/courses/:id', courses.deleteCourse);


app.get('/users', users.findAll);
app.get('/users/:id', users.findOne);
app.get('/users/courselist/:id', users.courselist);
app.get('/users/score/:id', users.fullScore);
app.get('/users/filter/:filter', users.findByName);

app.post('/users', users.addUser);
//{"name":"Temp User"}

app.put('/users/:id', users.updateName);

app.delete('/users/:id', users.deleteUser);





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
