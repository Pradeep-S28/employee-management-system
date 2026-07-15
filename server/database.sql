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

-- Task 6: Performance Management & Appraisal Module

CREATE TABLE IF NOT EXISTS performance_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  review_period VARCHAR(50) NOT NULL,
  self_rating INT NOT NULL,
  self_comments TEXT NOT NULL,
  manager_rating INT NULL,
  manager_feedback TEXT NULL,
  status ENUM('Draft', 'Submitted', 'Reviewed') NOT NULL DEFAULT 'Submitted',
  reviewed_on TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_performance_employee
  FOREIGN KEY (employee_id)
  REFERENCES employees(id)
  ON DELETE CASCADE,

  CONSTRAINT chk_self_rating
  CHECK (self_rating BETWEEN 1 AND 5),

  CONSTRAINT chk_manager_rating
  CHECK (manager_rating IS NULL OR manager_rating BETWEEN 1 AND 5)
);

-- Task 7: Payroll & Salary Management Module

CREATE TABLE IF NOT EXISTS salary_structures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  hra DECIMAL(10,2) NOT NULL,
  allowances DECIMAL(10,2) NOT NULL,
  deductions DECIMAL(10,2) NOT NULL,
  net_salary DECIMAL(10,2) 
    GENERATED ALWAYS AS (basic_salary + hra + allowances - deductions) STORED,
  effective_from DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_salary_employee
  FOREIGN KEY (employee_id)
  REFERENCES employees(id)
  ON DELETE CASCADE,

  CONSTRAINT chk_basic_salary CHECK (basic_salary >= 0),
  CONSTRAINT chk_hra CHECK (hra >= 0),
  CONSTRAINT chk_allowances CHECK (allowances >= 0),
  CONSTRAINT chk_deductions CHECK (deductions >= 0)
);

CREATE TABLE IF NOT EXISTS payslips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  salary_structure_id INT NOT NULL,
  pay_month VARCHAR(20) NOT NULL,
  days_worked INT NOT NULL,
  leave_deductions DECIMAL(10,2) NOT NULL DEFAULT 0,
  final_amount_paid DECIMAL(10,2) NOT NULL,
  generated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Generated', 'Paid') NOT NULL DEFAULT 'Generated',

  CONSTRAINT fk_payslip_employee
  FOREIGN KEY (employee_id)
  REFERENCES employees(id)
  ON DELETE CASCADE,

  CONSTRAINT fk_payslip_salary_structure
  FOREIGN KEY (salary_structure_id)
  REFERENCES salary_structures(id)
  ON DELETE CASCADE,

  CONSTRAINT chk_days_worked CHECK (days_worked >= 0),
  CONSTRAINT chk_leave_deductions CHECK (leave_deductions >= 0),
  CONSTRAINT chk_final_amount CHECK (final_amount_paid >= 0),

  CONSTRAINT unique_employee_month UNIQUE (employee_id, pay_month)
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Leave', 'Half Day') NOT NULL,
  check_in TIME NULL,
  check_out TIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE,

  UNIQUE KEY unique_employee_attendance (
    employee_id,
    attendance_date
  )
);




INSERT INTO attendance
(employee_id, attendance_date, status, check_in, check_out)
VALUES
(2, '2026-07-01', 'Present', '09:30:00', '18:30:00'),
(2, '2026-07-02', 'Present', '09:35:00', '18:25:00'),
(2, '2026-07-03', 'Leave', NULL, NULL),
(2, '2026-07-04', 'Absent', NULL, NULL),

(5, '2026-07-01', 'Present', '09:20:00', '18:20:00'),
(5, '2026-07-02', 'Half Day', '09:30:00', '13:30:00'),
(5, '2026-07-03', 'Present', '09:25:00', '18:15:00'),
(5, '2026-07-04', 'Present', '09:40:00', '18:35:00');


SELECT * FROM attendance;

-- task 9

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee';

  ALTER TABLE employees
  ADD COLUMN manager_id INT NULL AFTER designation;

ALTER TABLE employees
  ADD CONSTRAINT fk_employee_manager
  FOREIGN KEY (manager_id)
  REFERENCES employees(id)
  ON DELETE SET NULL;

  ALTER TABLE performance_reviews
  DROP FOREIGN KEY fk_performance_employee;

ALTER TABLE performance_reviews
  DROP CHECK chk_self_rating,
  DROP CHECK chk_manager_rating;

ALTER TABLE performance_reviews
  DROP COLUMN self_rating,
  DROP COLUMN self_comments,
  DROP COLUMN manager_rating,
  DROP COLUMN manager_feedback,
  DROP COLUMN status,
  DROP COLUMN reviewed_on;

ALTER TABLE performance_reviews
  ADD COLUMN manager_id INT NULL AFTER employee_id,
  ADD COLUMN overall_rating INT NULL,
  ADD COLUMN overall_feedback TEXT NULL,
  ADD COLUMN review_status ENUM('Draft', 'Submitted', 'Completed') NOT NULL DEFAULT 'Draft',
  ADD COLUMN submitted_on TIMESTAMP NULL;

ALTER TABLE performance_reviews
  ADD CONSTRAINT fk_performance_employee
  FOREIGN KEY (employee_id)
  REFERENCES employees(id)
  ON DELETE CASCADE,
  ADD CONSTRAINT fk_performance_manager
  FOREIGN KEY (manager_id)
  REFERENCES employees(id)
  ON DELETE SET NULL;

ALTER TABLE performance_reviews
  ADD CONSTRAINT chk_overall_rating
  CHECK (overall_rating IS NULL OR overall_rating BETWEEN 1 AND 5);

ALTER TABLE performance_reviews
  ADD CONSTRAINT unique_employee_review_period
  UNIQUE (employee_id, review_period);

  CREATE TABLE IF NOT EXISTS performance_kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  kpi_name VARCHAR(150) NOT NULL,
  kpi_score INT NOT NULL,
  remarks TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_kpi_review
  FOREIGN KEY (review_id)
  REFERENCES performance_reviews(id)
  ON DELETE CASCADE,

  CONSTRAINT chk_kpi_score
  CHECK (kpi_score BETWEEN 1 AND 5)
);

-- demo data
UPDATE employees SET manager_id = 2 WHERE id = 5;

INSERT INTO users (username, password, role, employee_id)
VALUES (
  'manager',
  '$2b$10$imwe3TO8h/jZnDOXs2QkCOWfSf2BQ8bYgtnFukpvEZ3kS07Gm.I9a',
  'manager',
  2
);