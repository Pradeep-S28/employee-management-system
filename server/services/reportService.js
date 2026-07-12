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

module.exports = {
  getEmployeeReports,
};
