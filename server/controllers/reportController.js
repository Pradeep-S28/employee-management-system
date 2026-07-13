//packages
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const reportService = require("../services/reportService");

// helper func
const getExportData = (reportType, query, callback) => {
  const filters = {
    ...query,
    page: 1,
    limit: 10000,
  };

  if (reportType === "employees") {
    return reportService.getEmployeeReports(filters, callback);
  }

  if (reportType === "leaves") {
    return reportService.getLeaveReports(filters, callback);
  }

  if (reportType === "payroll") {
    return reportService.getPayrollReports(filters, callback);
  }

  callback(new Error("Invalid report type"));
};

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

const getPayrollReports = (req, res) => {
  const {
    employeeId = "",
    department = "",
    month = "",
    status = "",
    page = "1",
    limit = "5",
    sortBy = "generated_on",
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

  const allowedStatuses = ["", "Generated", "Paid"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid payslip status",
    });
  }

  const filters = {
    employeeId,
    department: department.trim(),
    month: month.trim(),
    status,
    page: pageNumber,
    limit: limitNumber,
    sortBy,
    order,
  };

  reportService.getPayrollReports(filters, (error, result) => {
    if (error) {
      console.error("Payroll report error:", error);

      return res.status(500).json({
        message: "Failed to generate payroll report",
      });
    }

    res.status(200).json(result);
  });
};

const getDashboardReports = (req, res) => {
  reportService.getDashboardReports((error, result) => {
    if (error) {
      console.error("Dashboard report error:", error);

      return res.status(500).json({
        message: "Failed to generate dashboard report",
      });
    }

    res.status(200).json(result);
  });
};

const exportCSV = (req, res) => {
  const { reportType } = req.query;

  if (!["employees", "leaves", "payroll"].includes(reportType)) {
    return res.status(400).json({
      message: "Invalid report type",
    });
  }

  getExportData(reportType, req.query, (error, result) => {
    if (error) {
      console.error("CSV export error:", error);

      return res.status(500).json({
        message: "Failed to export CSV report",
      });
    }

    const rows = result.data;

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No data available for export",
      });
    }

    const headers = Object.keys(rows[0]);

    const escapeCSV = (value) => {
      if (value === null || value === undefined) {
        return "";
      }

      const text = String(value).replace(/"/g, '""');
      return `"${text}"`;
    };

    const csvLines = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        headers.map((header) => escapeCSV(row[header])).join(","),
      ),
    ];

    const csvContent = csvLines.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${reportType}-report.csv"`,
    );

    res.send(csvContent);
  });
};

const exportExcel = (req, res) => {
  const { reportType } = req.query;

  if (!["employees", "leaves", "payroll"].includes(reportType)) {
    return res.status(400).json({
      message: "Invalid report type",
    });
  }

  getExportData(reportType, req.query, async (error, result) => {
    if (error) {
      console.error("Excel export error:", error);

      return res.status(500).json({
        message: "Failed to export Excel report",
      });
    }

    const rows = result.data;

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No data available for export",
      });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      const reportTitle = `${reportType.toUpperCase()} REPORT`;

      worksheet.addRow([reportTitle]);
      worksheet.addRow([`Generated: ${new Date().toLocaleString("en-IN")}`]);

      const appliedFilters = Object.entries(req.query)
        .filter(
          ([key, value]) =>
            key !== "reportType" && value !== "" && value !== undefined,
        )
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      worksheet.addRow([`Applied Filters: ${appliedFilters || "None"}`]);

      worksheet.addRow([]);

      const headers = Object.keys(rows[0]);

      worksheet.addRow(headers);

      rows.forEach((row) => {
        worksheet.addRow(headers.map((header) => row[header]));
      });

      worksheet.getRow(1).font = {
        bold: true,
        size: 16,
      };

      worksheet.getRow(5).font = {
        bold: true,
      };

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${reportType}-report.xlsx"`,
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (exportError) {
      console.error("Excel generation error:", exportError);

      res.status(500).json({
        message: "Failed to generate Excel file",
      });
    }
  });
};

const exportPDF = (req, res) => {
  const { reportType } = req.query;

  if (!["employees", "leaves", "payroll"].includes(reportType)) {
    return res.status(400).json({
      message: "Invalid report type",
    });
  }

  getExportData(reportType, req.query, (error, result) => {
    if (error) {
      console.error("PDF export error:", error);

      return res.status(500).json({
        message: "Failed to export PDF report",
      });
    }

    const rows = result.data;

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No data available for export",
      });
    }

    const document = new PDFDocument({
      margin: 40,
      size: "A4",
      layout: "landscape",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${reportType}-report.pdf"`,
    );

    document.pipe(res);

    document.fontSize(18).text(`${reportType.toUpperCase()} REPORT`, {
      align: "center",
    });

    document.moveDown();

    document
      .fontSize(10)
      .text(`Generated: ${new Date().toLocaleString("en-IN")}`);

    const appliedFilters = Object.entries(req.query)
      .filter(
        ([key, value]) =>
          key !== "reportType" && value !== "" && value !== undefined,
      )
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    document.text(`Applied Filters: ${appliedFilters || "None"}`);

    document.moveDown();

    rows.forEach((row, index) => {
      document.fontSize(9).text(`Record ${index + 1}`, {
        underline: true,
      });

      Object.entries(row).forEach(([key, value]) => {
        document.text(
          `${key}: ${value === null || value === undefined ? "" : value}`,
        );
      });

      document.moveDown();
    });

    document.end();
  });
};

module.exports = {
  getEmployeeReports,
  getLeaveReports,
  getPayrollReports,
  getDashboardReports,
  exportCSV,
  exportExcel,
  exportPDF,
};
