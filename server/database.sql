CREATE DATABASE IF NOT EXISTS employee_management;

USE employee_management;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  date_of_joining DATE NOT NULL,
  status ENUM('Active', 'On Leave', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees 
(full_name, email, department, designation, date_of_joining, status)
VALUES
('Asha Reddy', 'asha@example.com', 'Engineering', 'Software Developer', '2023-01-10', 'Active'),
('Vikram Kumar', 'vikram@example.com', 'HR', 'HR Executive', '2022-08-15', 'Active'),
('Priya Sharma', 'priya@example.com', 'Finance', 'Accountant', '2021-05-20', 'On Leave'),
('Rohit Verma', 'rohit@example.com', 'Marketing', 'Marketing Executive', '2024-02-01', 'Inactive'),
('Sneha Iyer', 'sneha@example.com', 'Engineering', 'Frontend Developer', '2023-11-12', 'Active');