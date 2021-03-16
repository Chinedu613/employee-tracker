// npm packages

const inquirer = require("inquirer");
const cTable = require("console.table");
// modules
const connection = require('./db.js');

const startTracker = () => {
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
        "Add Department",
        "Add Role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.start) {
        case "View All Employees":
          allEmployees();
          startTracker();
          break;
        case "View All Employees By Department":
          viewDepartment();
          break;
        case "View All Employees by Manager":
          //manager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          //removeEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Update Employee Manager":
          //updateManager();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          //addRole();
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

const updateManager = () => {};

module.exports = startTracker; 

/* console.table(`Employee ID: ${res[0].id}, First Name: ${res[0].first_name}, Last Name: ${res[0].last_name}, role_`) */


const allEmployees = () => {
  console.log('-------HERE----------')
  connection.query('SELECT * FROM employees', (err, res) =>{
    if (err) throw 'WHATS GOING ON',err;
    console.table(res);
      startTracker();
  })
} 

startTracker();


//-----------------------------UPDATE ROLE ---------------------------------

 /* const updateRole = () => {
  //COMBINE FIRST AND LAST NAME FOR CHOICES PROMPT
  query = 'SELECT employees.first_name + employees.last_name AS name, title '
  query += 'FROM employees JOIN roles ON employees.role_id=role_id'
  connection.query(query, (err, res) =>{
    if (err) throw err;
    console.table(res);
    inquirer.prompt([
    {
      type:'list',
      name: 'name',
      choices() {
        const nameArray = [];
        res.forEach(({name}) => {
          nameArray.push(name);
        });
        return nameArray;
      },
      message: 'Which Employees Role do you want to update?'
    },
    {
      type: 'list',
      name: 'roles',
      choices() {
        const 
      }
    }
  ])
  .then((answers) => {
    
    if(Department.name === answers.departments){
      modDepartment = Department;
      connection.query('UPDATE roles SET ? WHERE ?',
      [
        {
          name: answers.departments,
        },
        {
          department_id: modDepartment.id,
        },
      ],
      (error) => {
        if(error) throw err;
        console.log('Successfully changed Department name!')
        startTracker();
      }); 
    }
  });
});
};  */

/* const addDepartment =  () => {
  connection.query('SELECT * FROM departments', (err, res) =>{
    if (err) throw err;
    console.table(res);
      inquirer.prompt([
      {
        type:'input',
        message: 'Please add Department you would like to add',
        name: 'addDepartment'
      },
    ])
    .then((answer) => {
      connection.query('INSERT INTO departments SET ?',
        {
          name: answer.addDepartment
        },
        (err) => {
          if (err)
          throw err;
          startTracker();
      }
    );
  });
});
} */
//-----------------------------------------ADD DEPARTMENT------------------------------
const addDepartment =  () => {
  connection.query('SELECT * FROM departments', (err, res) =>{
    if (err) throw err;
    console.table(res);
      inquirer.prompt([
      {
        type:'input',
        message: 'Please add Department you would like to add',
        name: 'addDepartment'
      },
    ])
    .then((answer) => {
      connection.query('INSERT INTO departments SET ?',
        {
          name: answer.addDepartment
        },
        (err) => {
          if (err)
          throw err;
          startTracker();
      }
    );
  });
});
}
///////// ADD EMPLOYEEEE -------------------------
const addEmployee = async () => {
  const roles = await viewallRoles();

  //console.log('----------217--------', roles)
  let text = /^[a-zA-Z]+$/;
  // array to hold new employee object/class
  let addworker = [];

  const answers = await inquirer.prompt([
      {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
          //validate: input => input == text ? true : "Please enter a name."
      },
      {
          type: 'input',
          name: 'last_name',
          message: "What is the employee's last name?",
          //validate: input => input == text ? true : "Please enter a name."
      },
      {
          type: 'list',
          name: 'title',
          choices: roles,
          message: 'What roles are we adding?'
      }
  ])
  
      connection.query(
          'INSERT INTO employees SET ?',
          { 
              first_name: answers.first_name,
              last_name: answers.last_name,
              role_id: answers.title
          },
          (err) => {
              if(err) throw err;
              console.log('You successfully added a new employee');
              startTracker()
          }
      );
};

const viewallRoles = () =>{
  
  connection.query = ('SELECT title FROM roles');

}