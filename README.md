# Employee Management System

A full-stack Employee Management System built using **React.js, Node.js, Express.js, MySQL, JWT Authentication, and Role-Based Access Control (RBAC)**.

This project allows users to securely login and manage employee records. Admin users can add, update, delete, and view employees, while employee users can only view employee data.

---

## Project Overview

The Employee Management System is a responsive web application used to manage employee records.

The project includes:

- React.js frontend
- Node.js and Express.js backend
- MySQL database
- JWT-based authentication
- Role-Based Access Control
- Protected API routes
- Responsive dashboard UI

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

- Login system using username and password
- JWT token generation after successful login
- Invalid login handling
- Logout functionality
- Protected frontend dashboard

### Role-Based Access Control

Three roles are implemented (the **Manager** role was added in Task 9):

#### Admin

Admin can:

- View all employees
- Add new employees
- Edit employee details
- Delete employees
- Search, filter, sort, and paginate records
- Approve or reject employee leave requests
- Create, update, and view all performance appraisals and KPIs
- Set and update employee salary structures
- Generate and manage employee payslips

#### Manager (Task 9)

Manager can:

- Login to the system
- View employee records
- Create and update performance reviews and KPIs, but only for employees
  who report to them (`employees.manager_id`)
- View the performance dashboard (cards + charts)
- Submit leave requests and track their own status, same as an employee

#### Employee

Employee can:

- Login to the system
- View employee records
- Search, filter, sort, and paginate records
- Submit leave requests and track their status
- View their own completed performance reviews and KPI feedback
- View their own salary structure and payslips

Employee users cannot add, edit, or delete employee records.

---

## Dashboard Summary

The dashboard displays summary cards for:

- Total Employees
- Active Employees
- Employees on Leave
- Departments Count

The cards update automatically based on backend data.

---

## Employee Management

Admin can manage employee records with the following features:

- View all employees in a responsive table
- Add new employee
- Edit existing employee
- Delete employee
- View complete employee details in a modal

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

## API Integration

- Axios is used for frontend API calls
- Backend REST APIs are built with Express.js
- JWT token is sent in request headers for protected routes
- Error messages are displayed for failed API requests

---

## Screenshots

### Login Page

<img src="./screenshots/login_form.png" alt="Login Page" width="600" />

### Admin Dashboard View

<img src="./screenshots/login_admin_view.png" alt="Admin Dashboard" width="600" />

### Employee Dashboard View

<img src="./screenshots/login_employee_view.png" alt="Employee Dashboard" width="600" />

### Dashboard and Employee Table

<img src="./screenshots/Dashboard&table.png" alt="Dashboard Table" width="600" />

### Employee Form

<img src="./screenshots/form.png" alt="Employee Form" width="600" />

### Employee Leave Request View

<img src="./screenshots/employeeview_leave_request.png" alt="Employee Leave Request View" width="600" />

### Admin Leave Approval View

<img src="./screenshots/adminview_leave_request.png" alt="Admin Leave Approval View" width="600" />

### Reporting Dashboard Charts

<img src="./screenshots/charts.png" alt="Reporting Dashboard Charts" width="600" />

### Performance Review Table

<img src="./screenshots/performance-reviews.png" alt="performance-reviews" width="600" />

### Payroll - Salary Structure & Payslip Generation

<img src="./screenshots/payroll-1.png" alt="Payroll Salary Structure" width="600" />

### Payroll - Payslip History

<img src="./screenshots/payroll-2.png" alt="Payroll Payslip History" width="600" />

### Payroll - Analytics Dashboard

<img src="./screenshots/payroll-3.png" alt="Payroll Analytics Dashboard" width="600" />

### Mobile Responsive View

<img src="./screenshots/mobile%20responsive%201.png" alt="Mobile Responsive 1" width="350" />

<img src="./screenshots/mobile%20responsive%202.png" alt="Mobile Responsive 2" width="350" />

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
│       │   ├── PerformanceReviewForm.jsx
│       │   ├── PerformanceReviewTable.jsx
│       │   ├── PerformanceDashboard.jsx
│       │   ├── KPIForm.jsx
│       │   ├── RatingChart.jsx
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
│   │   ├── reportServices.js
│   │   └── performanceService.js
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
│   ├── employeeview_leave_request.png
│   ├── adminview_leave_request.png
│   ├── charts.png
│   ├── performance-reviews.png
│   ├── payroll-1.png
│   ├── payroll-2.png
│   ├── payroll-3.png
│   ├── mobile responsive 1.png
│   └── mobile responsive 2.png
│
├── README.md
├── package.json
└── .gitignore
```

### Leave Management Module

- Employees can submit leave requests with leave type, start date, end date, and reason.
- Mandatory field validation is added for the leave request form.
- End date must be greater than or equal to start date.
- Employees can view only their own leave request status.
- Admin can view all leave requests.
- Admin can filter leave requests by status and leave type.
- Admin can approve or reject pending leave requests with confirmation.

### Visual Reporting Dashboard

- Employees by Department chart.
- Leave Requests by Status chart.
- Leave Requests by Type chart.
- Charts are built using Recharts.
- Dashboard charts update using live API data.
- Loading and empty states are handled for reports and leave data.

## Performance Management & Appraisal Module

> **Superseded by Task 9.** The Task 6 self-appraisal flow described below has
> been replaced by the manager-driven, KPI-based appraisal module documented
> in the [Task 9 section](#task-9-employee-performance-management--appraisal-module)
> further down. It's kept here only as a changelog of what Task 6 originally
> added.

As part of Task 6, employees could submit a self-appraisal (review period,
self rating, self comments) and admins could add a manager rating and
feedback. That flow, and its `PerformanceForm.jsx` / `PerformanceTable.jsx` /
`PerformanceCharts.jsx` components, no longer exist in the codebase — see
Task 9 for the current implementation.

---

## Task 9: Employee Performance Management & Appraisal Module

Task 9 replaces the Task 6 self-appraisal flow with a manager-driven,
KPI-based appraisal workflow, and introduces a **manager** role in addition
to the existing admin/employee roles.

### Roles

| Role              | What they can do in this module                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**         | Full access — create/update reviews and KPIs for any employee, view the dashboard, view all records.                                                  |
| **Manager** (new) | Create and update reviews and KPIs, but only for employees whose `manager_id` points back to them (their own team). Sees the same dashboard as admin. |
| **Employee**      | Read-only. Can only view their own reviews, and only once a review's status is `Submitted` or `Completed`.                                            |

Reporting-manager relationships live on `employees.manager_id` (self
referencing FK). Admin assigns this from the **Reporting Manager** field on
the Add/Edit Employee form.

There's no in-app screen for creating login accounts (this project has
always added rows to `users` directly), so to test the manager role, either
use the seeded `manager` / `manager123` account or add another one the same
way — see the SQL comments in `server/database.sql`.

### Database Schema

- **`performance_reviews`** (reworked): `id`, `employee_id` (FK), `manager_id`
  (FK, nullable), `review_period`, `overall_rating` (1–5), `overall_feedback`,
  `review_status` (`Draft` / `Submitted` / `Completed`), `submitted_on`,
  `created_at`. Unique on `(employee_id, review_period)` to block duplicate
  reviews for the same period.
- **`performance_kpis`** (new): `id`, `review_id` (FK, cascades on delete),
  `kpi_name`, `kpi_score` (1–5), `remarks`, `created_at`.
- **`employees.manager_id`** (new): self-referencing FK used to scope a
  manager to their team.
- **`users.role`**: widened to `ENUM('admin', 'manager', 'employee')`.

### API Documentation

All routes are under `/performance` and require a Bearer token.

| Method | Route                     | Who            | Description                                                                                                                    |
| ------ | ------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/performance/review`     | Manager, Admin | Create a review in `Draft` status for an employee + review period.                                                             |
| PUT    | `/performance/review/:id` | Manager, Admin | Update overall rating/feedback, or submit the review (`review_status: "Submitted"`). Only allowed while the review is `Draft`. |
| GET    | `/performance/reviews`    | All            | Admin sees all reviews; manager sees reviews they created; employee sees their own `Submitted`/`Completed` reviews.            |
| GET    | `/performance/review/:id` | All            | Single review with its KPIs, same visibility rules as above.                                                                   |
| POST   | `/performance/kpi`        | Manager, Admin | Add a KPI to a `Draft` review.                                                                                                 |
| PUT    | `/performance/kpi/:id`    | Manager, Admin | Edit a KPI on a `Draft` review.                                                                                                |
| DELETE | `/performance/kpi/:id`    | Manager, Admin | Remove a KPI from a `Draft` review.                                                                                            |
| GET    | `/performance/dashboard`  | Manager, Admin | Summary cards + chart data (see below).                                                                                        |

### Validation & Business Rules

- KPI scores and the overall rating must be between 1 and 5.
- A review needs at least **3 KPIs** before it can be submitted.
- Once a review is `Submitted`, its fields and KPIs can no longer be edited
  or deleted.
- Duplicate reviews for the same employee + review period are rejected
  (both at the API level and with a DB unique constraint).
- A manager can only create/update reviews and KPIs for employees in their
  own team (`employees.manager_id`).

### Dashboard

- Cards: Total Reviews, Pending Reviews, Completed Reviews, Average Rating.
- Charts (Recharts, via a shared `RatingChart.jsx` component): Department-wise
  Average Rating (bar), Rating Distribution (pie), Monthly Completed Reviews
  (line), Top Performing Departments (bar).

### Frontend Components

- `PerformanceReviewForm.jsx` — manager/admin picks an employee + review
  period to start a Draft review.
- `PerformanceReviewTable.jsx` — role-aware list of reviews; clicking a row
  opens KPI management (for reviewers) or a read-only view (for employees).
- `KPIForm.jsx` — adds a single KPI to a Draft review.
- `PerformanceDashboard.jsx` — the summary cards and charts described above.
- `RatingChart.jsx` — a small reusable chart card (bar/pie/line) shared by
  all four dashboard charts.

### Performance Workflow

```text
Manager/Admin Login
     ↓
Create Review (Draft) for an employee + review period
     ↓
Add at least 3 KPIs, set overall rating & feedback
     ↓
Submit Review → Status: Submitted (locked, no further edits)
     ↓
Employee Login → views the completed review and its KPIs
     ↓
Dashboard Cards & Charts Updated
```

### Setup Instructions (Task 9 only)

1. Apply the Task 9 SQL changes — see the `--task 9` block in
   `server/database.sql` (also copied into `Postman` folder notes). Quickest
   way, from the `server/` folder:
   ```bash
   mysql -u root -p employee_management < database.sql
   ```
2. Restart the server (`npm run dev` inside `server/`) so the new routes in
   `performanceRoutes.js` are picked up.
3. Log in as `manager` / `manager123` (or `admin` / `admin123`) to try the
   new "Start a Performance Review" form and dashboard under the
   **Performance** tab.

## Payroll Management Module

As part of Task 8, a Payroll Management Module was added to the existing Employee Management System, allowing admins to define salary structures and generate payslips, while employees can view their own salary and payslip history.

### Features Added

- Admin can set a salary structure for any employee with basic salary, HRA, allowances, deductions, and an effective-from date.
- Net salary is auto-calculated as `Basic Salary + HRA + Allowances - Deductions` and previewed live in the form.
- All salary fields are validated as required, numeric, and non-negative before submission.
- Admin can view the latest salary structure of any employee; employees can view only their own.
- Admin can generate a payslip for an employee by selecting the pay month, days worked, and leave deductions.
- The final amount paid is auto-calculated from the employee's net salary minus leave deductions.
- Duplicate payslips for the same employee and pay month are blocked.
- Payslip status can be tracked as `Generated` or `Paid`.
- Admin can view payslip history for all employees; employees can view only their own payslip history.
- Each payslip has a detailed view showing salary breakup, pay month, days worked, deductions, and final amount paid.
- A Payroll Analytics dashboard displays:
  - KPI cards for total payroll paid this month, payslips generated, and payslips pending.
  - Monthly payroll trend chart.
  - Department-wise payroll distribution chart.
- Payroll charts are built using Recharts and update from live API data.
- APIs are protected using JWT authentication.
- Role-based access control is applied:
  - Employee can view only their own salary structure and payslips.
  - Admin can set salary structures, generate payslips, and view payroll analytics.
- Frontend is organized using reusable components:
  - `SalaryForm.jsx`
  - `PayslipGenerator.jsx`
  - `PayslipTable.jsx`
  - `PayrollCharts.jsx`

### Payroll Workflow

```text
Admin Login
     ↓
Set Employee Salary Structure
     ↓
Generate Monthly Payslip
     ↓
Status: Generated
     ↓
Payment Processed
     ↓
Status: Paid
     ↓
Payroll Analytics Dashboard Updated
```
