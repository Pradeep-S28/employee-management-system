const db = require("../config/db");

const getEmployeeReports = (filters, callback) => {
  const {
    search = "",
    department = "",
    status = "",
    page = 1,
    limit = 5,
    sortBy = "id",
    order = "desc",
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "id",
    "full_name",
    "department",
    "designation",
    "date_of_joining",
    "status",
  ];

  const allowedOrderValues = ["asc", "desc"];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "id";

  const safeOrder = allowedOrderValues.includes(order.toLowerCase())
    ? order.toUpperCase()
    : "DESC";

  let whereClause = "WHERE 1 = 1";
  const queryValues = [];

  if (search) {
    whereClause += `
      AND (
        full_name LIKE ?
        OR department LIKE ?
        OR designation LIKE ?
      )
    `;

    const searchValue = `%${search}%`;

    queryValues.push(searchValue, searchValue, searchValue);
  }

  if (department) {
    whereClause += " AND department = ?";
    queryValues.push(department);
  }

  if (status) {
    whereClause += " AND status = ?";
    queryValues.push(status);
  }

  const countSql = `
    SELECT COUNT(*) AS totalRecords
    FROM employees
    ${whereClause}
  `;

  db.query(countSql, queryValues, (countError, countResult) => {
    if (countError) {
      return callback(countError);
    }

    const totalRecords = countResult[0].totalRecords;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    const reportSql = `
      SELECT
        id,
        full_name,
        email,
        department,
        designation,
        date_of_joining,
        status,
        created_at
      FROM employees
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const reportValues = [...queryValues, limitNumber, offset];

    db.query(reportSql, reportValues, (reportError, reportResult) => {
      if (reportError) {
        return callback(reportError);
      }

      callback(null, {
        data: reportResult,
        pagination: {
          currentPage: pageNumber,
          limit: limitNumber,
          totalRecords,
          totalPages,
        },
      });
    });
  });
};

const getLeaveReports = (filters, callback) => {
  const {
    employeeId = "",
    department = "",
    leaveType = "",
    status = "",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 5,
    sortBy = "requested_on",
    order = "desc",
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "requested_on",
    "start_date",
    "end_date",
    "full_name",
    "department",
    "leave_type",
    "status",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "requested_on";

  const safeOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  let whereClause = "WHERE 1 = 1";
  const queryValues = [];

  if (employeeId) {
    whereClause += " AND lr.employee_id = ?";
    queryValues.push(employeeId);
  }

  if (department) {
    whereClause += " AND e.department = ?";
    queryValues.push(department);
  }

  if (leaveType) {
    whereClause += " AND lr.leave_type = ?";
    queryValues.push(leaveType);
  }

  if (status) {
    whereClause += " AND lr.status = ?";
    queryValues.push(status);
  }

  if (startDate) {
    whereClause += " AND lr.start_date >= ?";
    queryValues.push(startDate);
  }

  if (endDate) {
    whereClause += " AND lr.end_date <= ?";
    queryValues.push(endDate);
  }

  const countSql = `
    SELECT COUNT(*) AS totalRecords
    FROM leave_requests lr
    JOIN employees e ON lr.employee_id = e.id
    ${whereClause}
  `;

  db.query(countSql, queryValues, (countError, countResult) => {
    if (countError) {
      return callback(countError);
    }

    const totalRecords = countResult[0].totalRecords;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    const reportSql = `
      SELECT
        lr.id,
        lr.employee_id,
        e.full_name,
        e.department,
        lr.leave_type,
        lr.start_date,
        lr.end_date,
        DATEDIFF(lr.end_date, lr.start_date) + 1 AS total_days,
        lr.reason,
        lr.status,
        lr.requested_on
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const reportValues = [...queryValues, limitNumber, offset];

    db.query(reportSql, reportValues, (reportError, reportResult) => {
      if (reportError) {
        return callback(reportError);
      }

      callback(null, {
        data: reportResult,
        pagination: {
          currentPage: pageNumber,
          limit: limitNumber,
          totalRecords,
          totalPages,
        },
      });
    });
  });
};

module.exports = {
  getEmployeeReports,
  getLeaveReports,
};
