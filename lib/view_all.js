
const connection = require('../db.js');

/* const allEmployees = () => {
    console.log('-------HERE----------')
    connection.query('SELECT * FROM employees', (err, res) =>{
        if (err) throw 'WHATS GOING ON',err;
        console.table(res);
        
    })
} */
const viewall = connection.query('SELECT * FROM employees', (err, res) =>{
    if (err) throw 'WHATS GOING ON',err;
    console.table(res);


const viewDepartment = () => {
    connection.query('SELECT * FROM departments', (err, res) =>{
        if (err) throw err;
        console.table(res);
        startTracker();
    
    });
};
module.exports = {allEmployees, viewDepartment}