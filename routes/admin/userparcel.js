'use strict'

const express = require('express')
const router = express.Router()

/** Check login session, apply to all routes */
router.all('/', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin/login')
  }
  next()
})

/** GET dashboard page */
router.get('/', function(req, res) {

  res.render('admin/userparcel', { 
    title: '用户包裹记录管理',
    currPage: 'userparcel',
    user: req.session.passport.user
  })
})

module.exports = router
