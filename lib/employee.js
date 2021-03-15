const addEmployee = () => {
    let text = /^[a-zA-Z]+$/;
    // array to hold new employee object/class
    let addworker = [];

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
            validate: input => input == text ? true : "Please enter a name."
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
            validate: input => input == text ? true : "Please enter a name."
        },
        {
            type: 'list',
            name: 'title',
            choices: ['Sales Lead','Salesperson','Lead Engineer', 'Software Engineer','Account', 'Legal Team Lead', 'Lawyer']
        }
    ])
    .then((answers) => {
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
    })
};

module.exports = addEmployee