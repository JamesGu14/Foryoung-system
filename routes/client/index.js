'use strict'

const express = require('express')
const router = express.Router()

router.get('/upload', function(req, res) {
  res.render('client/upload', { 
    title: '身份证照片上传'
  })
})

router.get('/tracking', function(req, res) {
  res.render('client/tracking', { 
    title: '身份证照片上传'
  })
})

module.exports = router
