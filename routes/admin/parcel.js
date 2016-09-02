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

/** GET dashboard page */
router.get('/', function (req, res) {
  
  res.render('admin/parcel', { 
    title: '快递信息管理',
    currPage: 'parcel',
    user: req.session.passport.user
  })
})

/** POST add parcels */
router.post('/add', function (req, res) {
  let parcels = req.body.parcels
  if (!Array.isArray(parcels)) {
    return res.json({
      res: '非数组形式，请重试'
    })
  }
  var query = ''
  parcels.forEach(function(parcel) {
    let subQuery = `insert into fy_parcel values (null, '${parcel.parcelNo}', 
      '${parcel.clientName}', '${parcel.clientIdNo}', null, null, 0, NOW());`
    query += subQuery
  }, this)

  mySqlConn.query(query, function (err, results) {
    if (err) {
      return res.json({
        res: '对不起，数据库连接失败，请稍后重试或联系系统管理员'
      })
    }
    // if (results.length > 0)
    return res.json({
      res: 'success'
    })
  })
})

module.exports = router
