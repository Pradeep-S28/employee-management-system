# Employee Management System

A full-stack Employee Management System built using **React.js, Node.js, Express.js, MySQL, JWT Authentication, Role-Based Access Control, Recharts, and Report Export Tools**.

The system allows administrators and employees to securely manage employee data, leave requests, performance reviews, payroll records, attendance data, reports, analytics, and downloadable business reports.

---

## Project Overview

The Employee Management System is a responsive web application used to manage employee-related operations.

The project includes:

- React.js frontend
- Node.js and Express.js backend
- MySQL database
- JWT-based authentication
- Role-Based Access Control
- Employee management
- Leave management
- Performance appraisal
- Payroll management
- Attendance reporting
- Reports and analytics dashboard
- CSV, Excel, and PDF exports
- Responsive dashboard UI

---

## Folder Structure

```txt
employee-management-system/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       │   ├── AttendanceReports.jsx
│       │   ├── DashboardCards.jsx
│       │   ├── DashboardReports.jsx
│       │   ├── EmployeeDetails.jsx
│       │   ├── EmployeeForm.jsx
│       │   ├── EmployeeReports.jsx
│       │   ├── EmployeeTable.jsx
│       │   ├── ExportButtons.jsx
│       │   ├── LeaveForm.jsx
│       │   ├── LeaveReports.jsx
│       │   ├── LeaveTable.jsx
│       │   ├── PayrollCharts.jsx
│       │   ├── PayrollReports.jsx
│       │   ├── PayslipGenerator.jsx
│       │   ├── PayslipTable.jsx
│       │   ├── PerformanceCharts.jsx
│       │   ├── PerformanceForm.jsx
│       │   ├── PerformanceTable.jsx
│       │   ├── ReportCharts.jsx
│       │   └── SalaryForm.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   └── Login.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   ├── payrollController.js
│   │   ├── performanceController.js
│   │   └── reportController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── payrollRoutes.js
│   │   ├── performanceRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── services/
│   │   └── reportServices.js
│   │
│   ├── database.sql
│   ├── server.js
│   └── .env
│
├── screenshots/
│   ├── login_form.png
│   ├── login_admin_view.png
│   ├── login_employee_view.png
│   ├── Dashboard&table.png
│   ├── form.png
│   ├── employee_leave_request_form.png
│   ├── employee_leave_status_table.png
│   ├── admin_leave_approval_view.png
│   ├── reporting_dashboard_charts.png
│   ├── performance_self_appraisal_form.png
│   ├── performance_review_history.png
│   ├── admin_performance_review_interface.png
│   ├── performance_dashboard_charts.png
│   ├── mobile_responsive_1.png
│   └── mobile_responsive_2.png
│   └── performance-reviews.png
│
├── README.md
├── package.json
└── .gitignore
```

---

## Tech Stack

### Frontend

- React.js
- JavaScript
- Bootstrap
- Axios
- Recharts
- HTML5
- CSS3
- Vite

### Backend

- Node.js
- Express.js
- MySQL
- mysql2
- JWT
- bcrypt
- ExcelJS
- PDFKit
- CORS
- dotenv

### Tools Used

- MySQL Workbench
- Postman
- Git & GitHub
- VS Code

---

## Features Implemented

### Authentication

- Login using username and password
- JWT token generation after successful login
- Invalid login handling
- Logout functionality
- Protected frontend dashboard
- Protected backend API routes

---

## Role-Based Access Control

Two roles are implemented:

### Admin

Admin can:

- View all employees
- Add new employees
- Edit employee details
- Delete employees
- Search, filter, sort, and paginate records
- View and manage leave requests
- Review employee performance
- Manage salary structures
- Generate payslips
- View reports and analytics
- Export reports as CSV, Excel, and PDF

### Employee

Employee can:

- Login to the system
- View employee data
- Submit leave requests
- View their own leave request status
- Submit self-appraisals
- View their own performance history
- View salary and payslip information

Employees cannot add, edit, or delete employee records.

---

## Dashboard Summary

The main dashboard displays summary cards for:

- Total Employees
- Active Employees
- Employees on Leave
- Departments Count

The cards update automatically based on available employee data.

---

## Employee Management

Admin can manage employee records using the following features:

- View all employees in a responsive table
- Add new employee
- Edit existing employee
- Delete employee
- View complete employee details
- Search employees
- Filter employees
- Sort employees
- Paginate employee records

---

## Search, Filter, Sort and Pagination

The employee table includes:

- Search by employee name or department
- Filter by status
- Filter by department
- Sort by date of joining
- Pagination with 5 records per page

---

## Form Validation

The employee form includes:

- Required field validation
- Email format validation
- Date of joining cannot be a future date
- Inline validation messages

---

## Leave Management Module

- Employees can submit leave requests
- Leave types include Sick, Casual, and Paid
- Start date, end date, and reason are required
- End date must be greater than or equal to start date
- Employees can view only their own leave requests
- Admin can view all leave requests
- Admin can filter leave requests by status and leave type
- Admin can approve or reject pending requests
- Confirmation is shown before status updates
- Leave summary analytics are available

---

## Performance Management & Appraisal Module

The Performance Management module allows employees and administrators to manage the review process.

### Features

- Employees can submit self-appraisals
- Self-rating range from 1 to 5
- Employees can add self-comments
- Employees can view their own review history
- Admin can view all performance reviews
- Admin can provide manager ratings
- Admin can provide manager feedback
- Review status changes from `Submitted` to `Reviewed`
- Performance analytics are displayed using Recharts

### Performance Analytics

- Average rating by department
- Rating distribution
- Performance review trend
- Reviewed performance KPI cards

### Performance Workflow

```text
Employee Login
     ↓
Submit Self-Appraisal
     ↓
Status: Submitted
     ↓
Admin Login
     ↓
Manager Review and Rating
     ↓
Status: Reviewed
     ↓
Performance Charts Updated
```
