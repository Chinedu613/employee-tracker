const mysql = require("mysql");
const util = require("util");
require('dotenv').config(); 
//const allEmployees = require('./lib/view_all');

const connection = mysql.createConnection(

  {
    host: 'localhost',
    port: 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

  }
);
  
  connection.connect();

  connection.query = util.promisify(connection.query);
  

module.exports = connection.query;
module.exports = connection;