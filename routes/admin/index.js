'use strict'

const express = require('express')
const router = express.Router()
var passport = require('../../code/passport')

/** GET dashboard page */
router.get('/', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin/login')
  }
  res.render('admin/dashboard', { 
    title: '后台系统首页',
    currPage: 'dashboard',
    user: req.session.passport.user
  })
})

/** GET login page */
router.get('/login', function(req, res) {
  res.render('admin/login', { title: 'Login' })
})

/** POST login page */
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/admin/login?cb=0' }),
  function (req, res) {
    res.redirect('/admin/')
  }
)

/** GET logout page */
router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/admin')
})


module.exports = router
