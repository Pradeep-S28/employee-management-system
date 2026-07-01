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


--task 5 sql code below

-- Link login users with employee records for leave module
ALTER TABLE users
ADD COLUMN employee_id INT NULL;

-- Leave requests table for Task 5
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  leave_type ENUM('Sick', 'Casual', 'Paid') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  requested_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_leave_employee
  FOREIGN KEY (employee_id)
  REFERENCES employees(id)
  ON DELETE CASCADE
);