'use strict'

const express = require('express')
const router = express.Router()
const multer  = require('multer')
var upload = multer({ dest: 'public/photos/' })
const fs = require('fs')
const mySqlConn = require('../../code/mysql')

router.get('/', function(req, res) {
  res.render('client/index', {
    title: '首页',
    currPage: 'home'
  })
})

/** GET upload photo page */
router.get('/upload', function(req, res) {
  res.render('client/upload', { 
    title: '身份证照片上传',
    currPage: 'upload'
  })
})

/** POST upload photo page */
router.post('/upload', upload.array('idPhoto', 2), function (req, res) {
  /**
   * Field validating
   * Photo size, type
   */
  let receiverName = req.body.receiverName
  let receiverId = req.body.receiverId
  let receiverMobile = req.body.receiverMobile

  var fieldValRes = validateFields(receiverName, receiverId, receiverMobile) 
  if (fieldValRes && fieldValRes.length > 0) {
    // if failed, delete files
    failedAndRemoveFiles(req.files)
    return res.json({
      res: fieldValRes
    })
  }

  var fileValRes = validateFiles(req.files)
  if (fileValRes && fileValRes.length > 0) {
    // if failed, delete files
    failedAndRemoveFiles(req.files)
    return res.json({
      res: fieldValRes
    })
  }

  /**
   * Rename file
   * Add data record
   */
  succeedAndRenameFiles(receiverId, req.files, function (newFiles) {
    let query = `update fy_parcel set frontPhotoPath = '${newFiles[0]}', backPhotoPath = '${newFiles[1]}' 
      where clientIdNo = '${receiverId.toLowerCase()}' and frontPhotoPath is null`
    
    mySqlConn.query(query, function (err, results) {
      if (err) {
        return res.json({
          res: '对不起，当前网络有问题，请稍后重试'
        })
      }
      if (results.changedRows <= 0) {
        let query = `insert into fy_unmatched_photo values (null, '${receiverName}', '${receiverId}', 
          '${receiverMobile}', '${newFiles[0]}', '${newFiles[1]}', null)`
        mySqlConn.query(query, function (err) {
          if (err) {
            return res.json({
              res: '对不起，当前网络有问题，请稍后重试'
            })
          }
          return res.json({
            res: 'success'
          })
        })
      } else {
        return res.json({
          res: 'success'
        })
      }
    })
  })
})

router.get('/tracking', function(req, res) {
  res.render('client/tracking', { 
    title: '身份证照片上传',
    currPage: 'tracking'
  })
})

/** Validate input fields from the upload page */
function validateFields(receiverName, receiverId, receiverMobile) {
  if (!receiverName || !receiverId || !receiverMobile) {
    return '所有项均为必填，请完整填写内容以便海关查验'
  }
  if (!/^\W{2,20}/.test(receiverName)) {
    return '请确认您填写了正确的收件人姓名'
  }
  if (receiverId.length < 15 || receiverId.length > 18) {
    return '请输入收件人的15至18位身份证号'
  } 
  let reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/
  if (reg.test(receiverId) === false) {
    return '请输入有效的收件人身份证号'
  }
  let mreg = /(^[0-9]*[1-9][0-9]*$)/
  if (receiverMobile.length != 11 || mreg.test(receiverMobile) === false) {
    return '请输入收件人的11位手机号码'
  }
  // false means no error
  return false
}

function validateFiles(files) {
  if (!Array.isArray(files) || files.length != 2) {
    return '请上传身份证正反两面'
  } 
  files.forEach(function(file) {
    if (!file.hasOwnProperty('mimetype') || file.mimetype.indexOf('image') < 0) {
      return '对不起，文件格式不符合，请尝试上传jpg, jpeg, png, gif等常用图片格式文件，谢谢'
    } 
    if (!file.hasOwnProperty('size') || file.size > 2 * 1024 * 1024 ) {
      return '对不起，文件大小超出2Mb，请使用截屏工具或画图工具缩小图片尺寸再上传，谢谢'
    }
  }, this)

  // false means no error
  return false
}

function failedAndRemoveFiles(files) {
  files.forEach(function(file) {
    fs.unlink(file.path)
  }, this)
}

function succeedAndRenameFiles(idNum, files, callback) {
  var index = 1
  var newFiles = []
  files.forEach(function(file) {
    let formatName = `public/photos/${idNum}_${index++}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`
    fs.renameSync(file.path, formatName)
    newFiles.push(formatName)
    if (newFiles.length == 2) {
      return callback(newFiles)
    }
  }, this)
}

module.exports = router
