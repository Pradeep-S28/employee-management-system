# Employee Management System

A full-stack Employee Management System built using React.js, Node.js, Express.js, and MySQL.  
This project allows users to add, view, update, delete, search, filter, sort, and paginate employee records.

---

## Project Overview

The Employee Management System is a responsive web application used to manage employee records.  
The frontend is built with React.js and Bootstrap, while the backend is built with Node.js and Express.js.  
Employee data is stored permanently in a MySQL database.

---

## Tech Stack

### Frontend
- React.js
- JavaScript
- Bootstrap
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- CORS
- dotenv

### Tools
- MySQL Workbench
- Postman
- Git & GitHub
- VS Code

---

## Features Implemented

### Dashboard Summary
- Total Employees count
- Active Employees count
- Employees on Leave count
- Departments count
- Cards update automatically based on backend data

### Employee Management
- View all employees in a responsive table
- Add new employee
- Edit existing employee
- Delete employee
- View complete employee details in a modal

### Search, Filter, Sort and Pagination
- Search by employee name or department
- Filter by status
- Filter by department
- Sort by date of joining
- Pagination with 5 records per page

### Form Validation
- Mandatory field validation
- Email format validation
- Date of joining cannot be a future date
- Inline validation messages

### API Integration
- Axios used for all API calls
- API calls structured in a dedicated service file
- Loading indicator while fetching data
- User-friendly error messages for API/network errors

### Responsive Design
- Works on desktop, tablet, and mobile screens
- Responsive table using Bootstrap

---

## Folder Structure

```txt
employee-management-system
├── client
│   └── src
│       ├── components
│       │   ├── DashboardCards.jsx
│       │   ├── EmployeeTable.jsx
│       │   ├── EmployeeForm.jsx
│       │   └── EmployeeDetails.jsx
│       ├── services
│       │   └── api.js
│       ├── pages
│       │   └── Dashboard.jsx
│       ├── styles
│       │   └── App.css
│       ├── App.jsx
│       └── main.jsx
└── server
    ├── config
    │   └── db.js
    ├── controllers
    │   └── employeeController.js
    ├── routes
    │   └── employeeRoutes.js
    ├── database.sql
    ├── server.js
    └── package.json
