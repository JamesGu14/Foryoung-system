'use strict'

const express = require('express')
const router = express.Router()
const mySqlConn = require('../../code/mysql')

/** Check login session, apply to all routes */
router.all('/', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin/login')
  }
  next()
})

/** GET userparcels page */
router.get('/', function(req, res) {

  let query = 'select * from fy_parcel order by id desc'
  mySqlConn.query(query, function (err, rows) {
    if (err) {
      return res.json({
        res: '数据库连接失败，请重新尝试或联系系统管理员'
      })
    }

    return res.render('admin/userparcel', {
      parcels: rows,  
      title: '用户包裹记录管理',
      currPage: 'userparcel',
      user: req.session.passport.user
    })
  })
})

/** DELETE userparcel in fy_parcel table */
router.delete('/delete/:id', function (req, res) {
  
  let query = `delete from fy_parcel where id = ${req.params.id}`
  mySqlConn.query(query, function (err) {
    if (err) {
      return res.json({
        res: '数据库连接失败，请重新尝试或联系系统管理员'
      })
    }
    return res.json({
      res: 'success'
    })
  })
})

module.exports = router
