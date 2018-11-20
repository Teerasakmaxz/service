var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');
var CourseOnline = require('./routes/CourseOnline');
var Category = require('./routes/Category');
var User = require('./routes/User');
var About = require('./routes/About');
var New = require('./routes/New');
var Usability = require('./routes/Usability');
var Faq = require('./routes/Faq');
var Lesson = require('./routes/Lesson');
var Login = require('./routes/Login')
var Contactus = require('./routes/Contactus')
var Learn = require('./routes/Learn')
var Video = require('./routes/Video')
var PreExams = require('./routes/PreExams')
var QuestionnaireCourse = require('./routes/QuestionnaireCourse')
var app = express();

var server = app.listen(13000, function () {
    console.log('Ready on port %d', server.address().port);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);
app.use('/CourseOnline', CourseOnline);
app.use('/Category', Category);
app.use('/User', User);
app.use('/About', About);
app.use('/New', New);
app.use('/Usability', Usability);
app.use('/Faq', Faq);
app.use('/Lesson',Lesson)
app.use('/Login',Login)
app.use('/Contactus',Contactus)
app.use('/Learn',Learn)
app.use('/Video',Video)
app.use('/Questionapi',PreExams)
app.use('/QuestionnaireCourse',QuestionnaireCourse)
console.log("maxz");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;