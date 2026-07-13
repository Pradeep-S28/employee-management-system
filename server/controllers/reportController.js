const reportService = require("../services/reportService");

const getEmployeeReports = (req, res) => {
  const {
    search = "",
    department = "",
    status = "",
    page = "1",
    limit = "5",
    sortBy = "id",
    order = "desc",
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return res.status(400).json({
      message: "Page must be a positive number",
    });
  }

  if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    return res.status(400).json({
      message: "Limit must be between 1 and 100",
    });
  }

  const allowedStatusValues = ["", "Active", "Inactive", "On Leave"];

  if (!allowedStatusValues.includes(status)) {
    return res.status(400).json({
      message: "Invalid employee status",
    });
  }

  const filters = {
    search: search.trim(),
    department: department.trim(),
    status,
    page: pageNumber,
    limit: limitNumber,
    sortBy,
    order,
  };

  reportService.getEmployeeReports(filters, (error, result) => {
    if (error) {
      console.error("Employee report error:", error);

      return res.status(500).json({
        message: "Failed to generate employee report",
      });
    }

    res.status(200).json(result);
  });
};

const getLeaveReports = (req, res) => {
  const {
    employeeId = "",
    department = "",
    leaveType = "",
    status = "",
    startDate = "",
    endDate = "",
    page = "1",
    limit = "5",
    sortBy = "requested_on",
    order = "desc",
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return res.status(400).json({
      message: "Page must be a positive number",
    });
  }

  if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    return res.status(400).json({
      message: "Limit must be between 1 and 100",
    });
  }

  if (
    employeeId &&
    (!Number.isInteger(Number(employeeId)) || Number(employeeId) < 1)
  ) {
    return res.status(400).json({
      message: "Invalid employee ID",
    });
  }

  const allowedLeaveTypes = ["", "Sick", "Casual", "Paid"];
  const allowedStatuses = ["", "Pending", "Approved", "Rejected"];

  if (!allowedLeaveTypes.includes(leaveType)) {
    return res.status(400).json({
      message: "Invalid leave type",
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid leave status",
    });
  }

  if (startDate && endDate && startDate > endDate) {
    return res.status(400).json({
      message: "Start date cannot be after end date",
    });
  }

  const filters = {
    employeeId,
    department: department.trim(),
    leaveType,
    status,
    startDate,
    endDate,
    page: pageNumber,
    limit: limitNumber,
    sortBy,
    order,
  };

  reportService.getLeaveReports(filters, (error, result) => {
    if (error) {
      console.error("Leave report error:", error);

      return res.status(500).json({
        message: "Failed to generate leave report",
      });
    }

    res.status(200).json(result);
  });
};

module.exports = {
  getEmployeeReports,
  getLeaveReports,
};
