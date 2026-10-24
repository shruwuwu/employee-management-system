-- Reference only: Hibernate creates these tables automatically (ddl-auto=update).
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE departments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(255),
  job_title VARCHAR(255),
  salary DECIMAL(12,2),
  joining_date DATE,
  department_id BIGINT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
