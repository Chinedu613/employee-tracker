
const mysql = require("mysql");
const util = require("util");
//const allEmployees = require('./lib/view_all');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dontknow1',
    database: 'employee_DB',
  });
  
  connection.connect();

  connection.query = util.promisify(connection.query);
  


module.exports = connection;