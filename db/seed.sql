INSERT INTO departments (name)
	VALUE('Sales'), ('Legal'), ('Finance'), ('Technology');

INSERT INTO roles (title, salary, department_id)
	VALUE('Sales Manager', '100000', 1),('Lawyer', '100000', 2),('Accountant', '100000', 3),('Lead Engineer', '100000', 4);
INSERT INTO employees (first_name, last_name, role_id)
	VALUE('Chin','Chuk','1');



SELECT * FROM departments;

SELECT * FROM roles;

SELECT * FROM employees;