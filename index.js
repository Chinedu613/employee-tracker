// npm packages

const inquirer = require("inquirer");
const cTable = require("console.table");
// modules
const connection = require('./db.js');
const { query } = require("./db.js");

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
          addRole();
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


/////////--------------------------------------- VIEW ALL EMPLOYEES -------------------------

const allEmployees = async () => {
  console.log('-------HERE----------')
  let query ='SELECT employees.first_name, employees.last_name, name AS department, title, salary '
  query += 'FROM employees JOIN roles ON employees.role_id=roles.role_id '
  query += 'JOIN departments ON roles.department_id=departments.department_id'
  connection.query(query, (err, res) =>{
    if (err) throw 'WHATS GOING ON',err;
      console.table(res);
      startTracker();
  })
} 

startTracker();


//-----------------------------UPDATE ROLE ---------------------------------

 const updateRole = async () => {
  const roles = await viewRoles()
  console.table(roles)
  const roleChoices = roles.map(({title}) =>({name:title}));
  const dupDepartments = roles.map(({name}) => ({name:name}));

  const set = new Set();

  let choices = await dupDepartments.filter(el => {
    const choices = set.has(el.name);
    set.add(el.name);
    return !choices;
  });
  const answers = await inquirer.prompt([
    {
      type:'rawlist',
      name: 'roles',
      message: 'Which Role do you want to update?',
      choices: roleChoices
    },
    {
      type: 'input',
      name: 'newRole',
      message:'What is the new job title?'
    },
    {
      type: 'input',
      name:'newSalary',
      message:'What is the new Salary?',
    },
    {
      type: 'rawlist',
      name:'newDepartment',
      message: 'What is the new Department?',
      choices: choices
    }

  ])

      connection.query('UPDATE roles SET ? WHERE ?',
      //WORK ON QUERY STRING
  /*     [
        {
          name: answers.departments,
        },
        {
          department_id: modDepartment.id,
        },
      ], */
      (error) => {
        if(error) throw err;
        console.log('Successfully changed Department name!')
        startTracker();
      }); 
}

const viewRoles = async () => connection.query('SELECT title, salary, name FROM roles JOIN departments ON roles.department_id=departments.department_id'); 

//-----------------------------------------ADD DEPARTMENT------------------------------


const addDepartment = async () => {
  const deparments = await justDepartments()

  
    console.table(deparments);
  const answers = await inquirer.prompt([
      {
        type:'input',
        message: 'Please add Department you would like to add',
        name: 'addDepartment'
      },
    ])
      connection.query('INSERT INTO departments SET ?',
        {
          name: answers.addDepartment
        },
        (err) => {
          if (err)
          throw err;
          startTracker();
        }
      );
};

const justDepartments = async () => connection.query('SELECT * FROM departments')
/////////--------------------------------------- ADD EMPLOYEEEE -------------------------
const addEmployee = async () => {
  const roles =  await viewallRoles();
  console.table(roles)
  const choices = await roles.map(({Title})=>({name:Title}));
// Regex for validation 
  let text = /^[a-zA-Z]+$/;

  const answers = await inquirer.prompt([
      {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
          validate: input => input !== text ? true : "Please enter a valid letter characters."
      },
      {
          type: 'input',
          name: 'last_name',
          message: "What is the employee's last name?",
          validate: input => input !== text ? true : "Please enter a valid letter characters."
      },
      {
          type: 'list',
          name: 'title',
          choices: choices,
          message: 'What is their job title?'
      }
  ])
  
      connection.query(
          `INSERT INTO employees SET employees.first_name='${answers.first_name}', employees.last_name='${answers.last_name}', employees.role_id=(SELECT roles.role_id FROM roles WHERE roles.title='${answers.title}')`,
          (err) => {
              if(err) throw err;
              console.log('You successfully added a new employee');
              startTracker()
          }
      );
};


const viewallRoles = async () =>  connection.query('SELECT title AS "Title", salary FROM roles');

/////////--------------------------------------- ADD ROLES -------------------------

const addRole = async () => {

const departments = viewRolestoADD();


console.table(departments)
let dupChoices = await departments.map(({name})=>({name:name}));

// Removing Duplicates of Departments with Set method & filter
const set = new Set();
// Filter to make new array to without duplicates the duplicates we do not want
let choices = await dupChoices.filter(el => { 
  const choices = set.has(el.name);
  set.add(el.name);
  return !choices;
});


const answers = await inquirer.prompt([
  {
    type: "input",
    name:"addRole",
    message: "What title would you like to add?"
  },
  {
    type: "input",
    name:"addSalary",
    message:"What is this roles yearly salary?"
  },
  {
    type: "rawlist",
    name: "addDepartment",
    choices: choices,
    message: "What department is this role a part of?"
  }
])
connection.query(
  `INSERT INTO roles SET roles.title ='${answers.addRole}', roles.salary='${answers.addSalary}', roles.department_id=(SELECT departments.department_id FROM departments WHERE departments.name='${answers.addDepartment}')`,
  (err) => {
    if(err) throw err;
    console.log('You sucessfully added a new role!');
    startTracker()
  }
);
};

const viewRolestoADD = () => connection.query('SELECT title, salary, name FROM roles JOIN departments ON roles.department_id=departments.department_id')
