// npm packages

const inquirer = require("inquirer");
const mysql = require("mysql");
const addEmployee = require('./lib/employee');
const cTable = require("console.table");



//Connection to Database

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dontknow1',
  database: 'employee_DB',
});

connection.connect((err) => {
  if (err) throw err;

  startTracker();
});

startTracker = () => {
  inquirer
    .prompt({
      type: "list",
      name: "start",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees by Managers",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.start) {
        case "View All Employees":
          allEmployees();
          break;
        case "View All Employees By Department":
          viewDepartment();
          break;
        case "View All Employees by Manager":
          manager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Employee Manager":
          updateManager();
          break;
        case "Exit":
          connection.end();
          break;
          default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const removeEmployee = () => {};
const updateRole = () => {};
const updateManager = () => {};


/* console.table(`Employee ID: ${res[0].id}, First Name: ${res[0].first_name}, Last Name: ${res[0].last_name}, role_`) */


const allEmployees = () => {
  console.log('-------HERE----------')
  connection.query('SELECT * FROM employees', (err, res) =>{
      if (err) throw 'WHATS GOING ON',err;
      console.table(res);
      startTracker();
  })
}