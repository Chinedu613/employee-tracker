// npm packages

const inquirer = require("inquirer");
const cTable = require("console.table");
// modules
const connection = require("./db.js");
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
        "View All Employees by Role",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Remove Employee",
        "Update Role",
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
        case "View All Employees by Role":
          employeesByRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Role":
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
startTracker();


const updateManager = () => {};

module.exports = startTracker;

/////////--------------------------------------- VIEW ALL EMPLOYEES -------------------------

const allEmployees = async () => {
  let query =
    "SELECT employees.first_name, employees.last_name, name AS department, title, salary ";
  query += "FROM employees JOIN roles ON employees.role_id=roles.role_id ";
  query += "JOIN departments ON roles.department_id=departments.department_id";
  connection.query(query, (err, res) => {
    if (err) throw ("WHATS GOING ON", err);
    console.table(res);
    startTracker();
  });
};

///------------------------------------ VIEW EMPLOYEES BY ROLE -------------------------------\\\

const employeesByRoles = async () => {
  const rolesObj = await allRoles();

  console.table(rolesObj);

  let dupRolesObj = await rolesObj.map(({ title }) => ({ name: title }));

  const set = new Set();

  let roleChoices = await dupRolesObj.filter((el) => {
    const roleChoices = set.has(el.title);
    set.add(el.title);
    return roleChoices;
  });

  const answers = await inquirer.prompt([
    {
      type: "rawlist",
      name: "viewRole",
      message: "Please choose the role",
      choices: roleChoices,
    },
  ]);
  connection.query(
    `SELECT employees.first_name, employees.last_name, title 
  FROM employees JOIN roles ON employees.role_id=roles.role_id
  WHERE title LIKE "${answers.viewRole}"`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
};
const allRoles = async () => {
  return connection.query(
    "SELECT employees.first_name, employees.last_name, title FROM employees JOIN roles ON employees.role_id=roles.role_id"
  );
};

///--------------------- VIEW EMPLOYEES BY DEPARTMENT -----------------\\\

const viewDepartment = async () => {
  const depatmentsView = await everyDepartment();

  console.table(depatmentsView);
  let dupChoices = await depatmentsView.map(({ name }) => ({ name: name }));

  const set = new Set();

  let departmentsList = await dupChoices.filter((el) => {
    const departmentsList = set.has(el.name);
    set.add(el.name);
    return !departmentsList;
  });

  const answers = await inquirer.prompt([
    {
      type: "rawlist",
      name: "choseDepartment",
      message: "Please choose a department",
      choices: departmentsList,
    },
  ]);
  let query = `SELECT employees.first_name, employees.last_name, name FROM `;
  query += ` employees JOIN roles ON employees.role_id=roles.role_id`;
  query += ` JOIN departments ON roles.department_id=departments.department_id WHERE name LIKE "${answers.choseDepartment}"`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startTracker();
  });
};

const everyDepartment = () => {
  let query = "SELECT employees.first_name, employees.last_name, name FROM ";
  query += " employees JOIN roles ON employees.role_id=roles.role_id";
  query += " JOIN departments ON roles.department_id=departments.department_id";

  return connection.query(query);
};

//-----------------------------UPDATE ROLE ---------------------------------

const updateRole = async () => {
  const roles = await letsUpdateRoles();
  console.table(roles);
  const roleChoices = roles.map(({ title }) => ({ name: title }));
  const nameList = roles.map(({ name }) => ({ name: name }));

  const set = new Set();

  let choices = await roleChoices.filter((el) => {
    const choices = set.has(el.name);
    set.add(el.name);
    return !choices;
  });
  const answers = await inquirer.prompt([
    {
      type: "rawlist",
      name: "chosenName",
      message: "Which Employee do you want to update?",
      choices: nameList,
    },
    {
      type: "rawlist",
      name: "newRole",
      message: "What is the new job title?",
      choices: choices,
    },
  ]);
  // Matches
  const idObj = roles.filter((name) => {
    if (name.name === answers.chosenName) return name.id;
  }); //.map(({id}) =>({name:id}));

  let id = idObj.map(({ id }) => ({ name: id }));

  id = id[0].name;

  connection.query(
    `UPDATE employees SET employees.role_id=(SELECT roles.role_id FROM roles WHERE roles.title="${answers.newRole}") WHERE employees.id=${id}`,

    (error) => {
      if (error) throw ("WEHAVE AN ERROR", err);
      console.log("Successfully changed Job Titles!");
      startTracker();
    }
  );
};

const letsUpdateRoles = async () => {
  return connection.query(
    'SELECT CONCAT(employees.first_name," ",employees.last_name) AS name, employees.id, title FROM employees JOIN roles ON employees.role_id=roles.role_id'
  );
};

//-----------------------------------------ADD DEPARTMENT------------------------------

const addDepartment = async () => {
  const deparments = await justDepartments();

  console.table(deparments);
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Please add Department you would like to add",
      name: "addDepartment",
    },
  ]);
  connection.query(
    "INSERT INTO departments SET ?",
    {
      name: answers.addDepartment,
    },
    (err) => {
      if (err) throw err;
      startTracker();
    }
  );
};

const justDepartments = async () =>
  connection.query("SELECT * FROM departments");
/////////--------------------------------------- ADD EMPLOYEEEE -------------------------
const addEmployee = async () => {
  const roles = await viewallRoles();
  console.table(roles);
  const choices = await roles.map(({ Title }) => ({ name: Title }));
  // Regex for validation
  let text = /^[a-zA-Z]+$/;

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
      validate: (input) =>
        input !== text ? true : "Please enter a valid letter characters.",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
      validate: (input) =>
        input !== text ? true : "Please enter a valid letter characters.",
    },
    {
      type: "list",
      name: "title",
      choices: choices,
      message: "What is their job title?",
    },
  ]);

  connection.query(
    `INSERT INTO employees SET employees.first_name='${answers.first_name}', employees.last_name='${answers.last_name}', employees.role_id=(SELECT roles.role_id FROM roles WHERE roles.title='${answers.title}')`,
    (err) => {
      if (err) throw err;
      console.log("You successfully added a new employee");
      startTracker();
    }
  );
};

const viewallRoles = async () =>
  connection.query('SELECT title AS "Title", salary FROM roles');

/////////--------------------------------------- ADD ROLES -------------------------

const addRole = async () => {
  const departments = await viewRolestoADD();

  console.log(departments);

  console.table(departments);
  let dupChoices = await departments.map(({ name }) => ({ name: name }));

  // Removing Duplicates of Departments with Set method & filter
  const set = new Set();
  // Filter to make new array to without duplicates the duplicates we do not want
  let choices = await dupChoices.filter((el) => {
    const choices = set.has(el.name);
    set.add(el.name);
    return !choices;
  });

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "addRole",
      message: "What title would you like to add?",
    },
    {
      type: "input",
      name: "addSalary",
      message: "What is this roles yearly salary?",
    },
    {
      type: "rawlist",
      name: "addDepartment",
      choices: choices,
      message: "What department is this role a part of?",
    },
  ]);
  connection.query(
    `INSERT INTO roles SET roles.title ='${answers.addRole}', roles.salary='${answers.addSalary}', roles.department_id=(SELECT departments.department_id FROM departments WHERE departments.name='${answers.addDepartment}')`,
    (err) => {
      if (err) throw err;
      console.log("You sucessfully added a new role!");
      startTracker();
    }
  );
};

const viewRolestoADD = () => {
  connection.query(
    "SELECT title, salary, name FROM roles JOIN departments ON roles.department_id=departments.department_id"
  );
};

////---------------------------------- REMOVE EMPLOYEE -----------------------------\\\\\\\\\\\
const removeEmployee = async () => {
  
  const employeesObj = await viewRemoveWorkers()
  
  console.table(employeesObj);
  
  const nameList =  employeesObj.map(({name}) => ({name:name}));

  const answers = await inquirer.prompt([
    {
      type: "rawlist",
      name: "unlucky",
      message: "Who are we removing?",
      choices: nameList
    }
  ])
  let id;
  const workerId =  employeesObj.filter((name) => {
    if(name.name === answers.unlucky) 
    
    return name.id
  });

  let employeeId = workerId.map(({ id }) => ({ name: id }));

  id = employeeId[0].name;

  connection.query(`DELETE FROM employees WHERE id=${id}`, (err) => {
    if (err) throw err;
    console.log('Successfully Removed');
    startTracker();
  }
  );
};

const viewRemoveWorkers = async() => {
  let query =
  "SELECT CONCAT(employees.first_name,' ',employees.last_name) AS name, employees.id, departments.name AS department, title, salary ";
query += "FROM employees JOIN roles ON employees.role_id=roles.role_id ";
query += "JOIN departments ON roles.department_id=departments.department_id ORDER BY name ASC";

return connection.query(query);
}
////---------------------------------- REMOVE DEPARTMENT -----------------------------\\\\\\\\\\\
////---------------------------------- REMOVE ROLE -----------------------------\\\\\\\\\\\
