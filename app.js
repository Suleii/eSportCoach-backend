require('dotenv').config();
require("./models/connection");

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bookingsRouter = require('./routes/bookings');
var coachesRouter = require('./routes/coaches');
var reviewsRouter = require('./routes/reviews');
var searchRouter = require('./routes/search');

var app = express();
const cors = require ('cors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bookings', bookingsRouter);
app.use('/coaches', coachesRouter);
app.use('/reviews', reviewsRouter);
app.use('/search', searchRouter);
app.use('/coaches', coachesRouter);

module.exports = app;
