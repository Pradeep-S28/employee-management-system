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

const getPayrollReports = (filters, callback) => {
  const {
    employeeId = "",
    department = "",
    month = "",
    status = "",
    page = 1,
    limit = 5,
    sortBy = "generated_on",
    order = "desc",
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "generated_on",
    "full_name",
    "department",
    "pay_month",
    "final_amount_paid",
    "status",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "generated_on";

  const safeOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  let whereClause = "WHERE 1 = 1";
  const values = [];

  if (employeeId) {
    whereClause += " AND p.employee_id = ?";
    values.push(employeeId);
  }

  if (department) {
    whereClause += " AND e.department = ?";
    values.push(department);
  }

  if (month) {
    whereClause += " AND p.pay_month = ?";
    values.push(month);
  }

  if (status) {
    whereClause += " AND p.status = ?";
    values.push(status);
  }

  const countSql = `
    SELECT COUNT(*) AS totalRecords
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    ${whereClause}
  `;

  db.query(countSql, values, (countError, countResult) => {
    if (countError) {
      return callback(countError);
    }

    const totalRecords = countResult[0].totalRecords;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    const reportSql = `
      SELECT
        p.id,
        p.employee_id,
        e.full_name,
        e.department,
        e.designation,
        p.pay_month,
        p.days_worked,
        p.leave_deductions,
        p.final_amount_paid,
        p.status,
        p.generated_on
      FROM payslips p
      JOIN employees e ON p.employee_id = e.id
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const reportValues = [...values, limitNumber, offset];

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

const getDashboardReports = (callback) => {
  const summarySql = `
    SELECT
      (SELECT COUNT(*) FROM employees) AS totalEmployees,

      (
        SELECT COUNT(*)
        FROM employees
        WHERE status = 'Active'
      ) AS activeEmployees,

      (
        SELECT COUNT(*)
        FROM employees
        WHERE status = 'On Leave'
      ) AS employeesOnLeave,

      (
        SELECT COALESCE(SUM(final_amount_paid), 0)
        FROM payslips
      ) AS totalPayrollProcessed,

      (
        SELECT COUNT(*)
        FROM leave_requests
        WHERE status = 'Pending'
      ) AS pendingLeaveRequests
  `;

  const monthlyAttendanceSql = `
  SELECT
    ROUND(
      (
        SUM(
          CASE
            WHEN status IN ('Present', 'Half Day') THEN 1
            ELSE 0
          END
        ) / COUNT(*)
      ) * 100,
      2
    ) AS monthlyAttendancePercentage
  FROM attendance
  WHERE DATE_FORMAT(attendance_date, '%Y-%m') =
        DATE_FORMAT(CURDATE(), '%Y-%m')
`;

  const attendanceTrendSql = `
  SELECT
    DATE_FORMAT(attendance_date, '%b %Y') AS month,
    ROUND(
      (
        SUM(
          CASE
            WHEN status IN ('Present', 'Half Day') THEN 1
            ELSE 0
          END
        ) / COUNT(*)
      ) * 100,
      2
    ) AS percentage
  FROM attendance
  GROUP BY
    YEAR(attendance_date),
    MONTH(attendance_date),
    DATE_FORMAT(attendance_date, '%b %Y')
  ORDER BY
    YEAR(attendance_date),
    MONTH(attendance_date)
`;

  const leaveDistributionSql = `
    SELECT
      leave_type AS name,
      COUNT(*) AS value
    FROM leave_requests
    GROUP BY leave_type
    ORDER BY value DESC
  `;

  const departmentEmployeeSql = `
    SELECT
      department AS name,
      COUNT(*) AS value
    FROM employees
    GROUP BY department
    ORDER BY value DESC
  `;

  const departmentPayrollSql = `
    SELECT
      e.department AS name,
      COALESCE(SUM(p.final_amount_paid), 0) AS value
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    GROUP BY e.department
    ORDER BY value DESC
  `;

  db.query(summarySql, (summaryError, summaryResult) => {
    if (summaryError) {
      return callback(summaryError);
    }

    db.query(monthlyAttendanceSql, (attendanceError, attendanceResult) => {
      if (attendanceError) {
        return callback(attendanceError);
      }

      db.query(attendanceTrendSql, (trendError, trendResult) => {
        if (trendError) {
          return callback(trendError);
        }

        db.query(
          leaveDistributionSql,
          (leaveDistributionError, leaveDistributionResult) => {
            if (leaveDistributionError) {
              return callback(leaveDistributionError);
            }

            db.query(
              departmentEmployeeSql,
              (departmentEmployeeError, departmentEmployeeResult) => {
                if (departmentEmployeeError) {
                  return callback(departmentEmployeeError);
                }

                db.query(
                  departmentPayrollSql,
                  (departmentPayrollError, departmentPayrollResult) => {
                    if (departmentPayrollError) {
                      return callback(departmentPayrollError);
                    }

                    callback(null, {
                      summary: {
                        ...summaryResult[0],
                        monthlyAttendancePercentage:
                          attendanceResult[0]?.monthlyAttendancePercentage || 0,
                      },
                      charts: {
                        attendanceTrend: trendResult,
                        leaveDistribution: leaveDistributionResult,
                        departmentEmployeeCount: departmentEmployeeResult,
                        departmentPayrollDistribution: departmentPayrollResult,
                      },
                    });
                  },
                );
              },
            );
          },
        );
      });
    });
  });
};

const getAttendanceReports = (filters, callback) => {
  const {
    employeeId = "",
    department = "",
    month = "",
    startDate = "",
    endDate = "",
    status = "",
    page = 1,
    limit = 5,
    sortBy = "attendance_date",
    order = "desc",
  } = filters;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "attendance_date",
    "full_name",
    "department",
    "status",
    "check_in",
    "check_out",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "attendance_date";

  const safeOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  let whereClause = "WHERE 1 = 1";
  const values = [];

  if (employeeId) {
    whereClause += " AND a.employee_id = ?";
    values.push(employeeId);
  }

  if (department) {
    whereClause += " AND e.department = ?";
    values.push(department);
  }

  if (month) {
    whereClause += " AND DATE_FORMAT(a.attendance_date, '%Y-%m') = ?";
    values.push(month);
  }

  if (startDate) {
    whereClause += " AND a.attendance_date >= ?";
    values.push(startDate);
  }

  if (endDate) {
    whereClause += " AND a.attendance_date <= ?";
    values.push(endDate);
  }

  if (status) {
    whereClause += " AND a.status = ?";
    values.push(status);
  }

  const countSql = `
    SELECT COUNT(*) AS totalRecords
    FROM attendance a
    JOIN employees e ON a.employee_id = e.id
    ${whereClause}
  `;

  db.query(countSql, values, (countError, countResult) => {
    if (countError) {
      return callback(countError);
    }

    const totalRecords = countResult[0].totalRecords;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    const reportSql = `
      SELECT
        a.id,
        a.employee_id,
        e.full_name,
        e.department,
        a.attendance_date,
        a.status,
        a.check_in,
        a.check_out
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const reportValues = [...values, limitNumber, offset];

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
  getPayrollReports,
  getDashboardReports,
  getAttendanceReports,
};
