CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE departments(
department_id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (department_id)
);

CREATE TABLE roles(
role_id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(18,2),
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(department_id),
PRIMARY KEY (role_id)
);

CREATE TABLE employees(
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(department_id),
FOREIGN KEY (role_id) REFERENCES roles(role_id),
PRIMARY KEY (id)
);

