'use strict'

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var passport = require('./code/passport')
var session = require('express-session')

var clients = require('./routes/client/index')
var routes = require('./routes/admin/index')
var users = require('./routes/admin/users')
var parcels = require('./routes/admin/parcel')
var userparcels = require('./routes/admin/userparcel')
var unmatched = require('./routes/admin/unmatched')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'foryoung',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', clients) 
app.use('/admin', routes)
app.use('/admin/parcel', parcels)
app.use('/admin/userparcel', userparcels)
app.use('/admin/unmatched', unmatched)
app.use('/admin/users', users)


// catch 404 and forward to error handler
app.use(function(req, res) {
  return res.render('notfound', {})
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
