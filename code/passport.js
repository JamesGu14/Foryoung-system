'use strict'

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
const mySqlConn = require('./mysql')

passport.use(new LocalStrategy(
  function (username, password, done) {
    let query = `select * from fy_adminuser where username = '${username}' and pwd = '${password}'`

    mySqlConn.query(query, function (err, rows, fields) {

      if (err) {
        return done(err)
      }

      if (!rows || rows.length <= 0) {
        return done(null, false, { message: '登录失败' })
      } else {
        return done(null, rows[0])
      }
    })
  }
))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  // User.findById(id, function (err, user) {
  //   done(err, user)
  // })
  let query = `select * from fy_adminuser where id = ${user.id}`

  mySqlConn.query(query, function (err, rows) {

    done(err, rows[0])
  })
})

module.exports = passport
