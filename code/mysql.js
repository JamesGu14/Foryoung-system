'use strict'

const mysql = require('mysql')
const Config = require('../config/')

var mysqlConn = mysql.createConnection({
  host: Config.get('/database/mysql/host'),
  port: Config.get('/database/mysql/port'),
  user: Config.get('/database/mysql/user'),
  password: Config.get('/database/mysql/pwd'),
  database: Config.get('/database/mysql/database'),
  multipleStatements: true
})

module.exports = mysqlConn
