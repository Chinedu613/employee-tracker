

const allEmployees = () => {
    console.log('-------HERE----------')
    connection.query('SELECT * FROM employees', (err, res) =>{
        if (err) throw 'WHATS GOING ON',err;
        console.table(res);
        startTracker();
    })
}

module.exports = allEmployees
/* exports.viewDepartment = () => {
    connection.query('SELECT * FROM employees JOIN....need to finish', (err, res) =>{
        if (err) throw err;
        console.table(res);
        startTracker();
    
    });
};
 */