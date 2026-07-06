const db = require("../config/db");

const isNonNegativeNumber = (value) => {
  return (
    value !== "" &&
    value !== null &&
    value !== undefined &&
    !isNaN(value) &&
    Number(value) >= 0
  );
};

// Admin sets salary structure
const setSalaryStructure = (req, res) => {
  const {
    employee_id,
    basic_salary,
    hra,
    allowances,
    deductions,
    effective_from,
  } = req.body;

  if (
    !employee_id ||
    basic_salary === undefined ||
    hra === undefined ||
    allowances === undefined ||
    deductions === undefined ||
    !effective_from
  ) {
    return res.status(400).json({
      message: "All salary fields are required",
    });
  }

  if (
    !isNonNegativeNumber(basic_salary) ||
    !isNonNegativeNumber(hra) ||
    !isNonNegativeNumber(allowances) ||
    !isNonNegativeNumber(deductions)
  ) {
    return res.status(400).json({
      message: "Salary fields must be numeric and non-negative",
    });
  }

  const employeeSql = "SELECT id FROM employees WHERE id = ?";

  db.query(employeeSql, [employee_id], (employeeError, employeeResult) => {
    if (employeeError) {
      return res.status(500).json({
        message: "Failed to verify employee",
      });
    }

    if (employeeResult.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const insertSql = `
      INSERT INTO salary_structures
      (employee_id, basic_salary, hra, allowances, deductions, effective_from)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [employee_id, basic_salary, hra, allowances, deductions, effective_from],
      (insertError, result) => {
        if (insertError) {
          return res.status(500).json({
            message: "Failed to save salary structure",
          });
        }

        res.status(201).json({
          message: "Salary structure saved successfully",
          salaryStructureId: result.insertId,
        });
      },
    );
  });
};

// Admin can view any employee salary, employee can view only own salary
const getSalaryStructure = (req, res) => {
  const { employeeId } = req.params;

  if (
    req.user.role !== "admin" &&
    Number(req.user.employee_id) !== Number(employeeId)
  ) {
    return res.status(403).json({
      message: "Access denied. You can view only your own salary structure.",
    });
  }

  const sql = `
    SELECT 
      ss.*,
      e.full_name,
      e.department,
      e.designation
    FROM salary_structures ss
    JOIN employees e ON ss.employee_id = e.id
    WHERE ss.employee_id = ?
    ORDER BY ss.effective_from DESC, ss.id DESC
    LIMIT 1
  `;

  db.query(sql, [employeeId], (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch salary structure",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Salary structure not found",
      });
    }

    res.status(200).json(result[0]);
  });
};

// Admin generates payslip
const generatePayslip = (req, res) => {
  const { employee_id, pay_month, days_worked, leave_deductions, status } =
    req.body;

  if (
    !employee_id ||
    !pay_month ||
    days_worked === undefined ||
    leave_deductions === undefined
  ) {
    return res.status(400).json({
      message:
        "Employee, pay month, days worked, and leave deductions are required",
    });
  }

  if (
    !isNonNegativeNumber(days_worked) ||
    !isNonNegativeNumber(leave_deductions)
  ) {
    return res.status(400).json({
      message: "Days worked and leave deductions must be non-negative numbers",
    });
  }

  if (status && !["Generated", "Paid"].includes(status)) {
    return res.status(400).json({
      message: "Status must be Generated or Paid",
    });
  }

  const duplicateSql = `
    SELECT id FROM payslips
    WHERE employee_id = ? AND pay_month = ?
  `;

  db.query(
    duplicateSql,
    [employee_id, pay_month],
    (duplicateError, duplicateResult) => {
      if (duplicateError) {
        return res.status(500).json({
          message: "Failed to check duplicate payslip",
        });
      }

      if (duplicateResult.length > 0) {
        return res.status(400).json({
          message: "Payslip already generated for this employee and month",
        });
      }

      const salarySql = `
      SELECT * FROM salary_structures
      WHERE employee_id = ?
      ORDER BY effective_from DESC, id DESC
      LIMIT 1
    `;

      db.query(salarySql, [employee_id], (salaryError, salaryResult) => {
        if (salaryError) {
          return res.status(500).json({
            message: "Failed to fetch salary structure",
          });
        }

        if (salaryResult.length === 0) {
          return res.status(404).json({
            message: "Salary structure not found for this employee",
          });
        }

        const salary = salaryResult[0];
        const finalAmountPaid =
          Number(salary.net_salary) - Number(leave_deductions);

        if (finalAmountPaid < 0) {
          return res.status(400).json({
            message: "Final amount cannot be negative",
          });
        }

        const insertSql = `
        INSERT INTO payslips
        (employee_id, salary_structure_id, pay_month, days_worked, leave_deductions, final_amount_paid, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

        db.query(
          insertSql,
          [
            employee_id,
            salary.id,
            pay_month,
            days_worked,
            leave_deductions,
            finalAmountPaid,
            status || "Generated",
          ],
          (insertError, result) => {
            if (insertError) {
              return res.status(500).json({
                message: "Failed to generate payslip",
              });
            }

            res.status(201).json({
              message: "Payslip generated successfully",
              payslipId: result.insertId,
              finalAmountPaid,
            });
          },
        );
      });
    },
  );
};

// Admin views all payslips, employee views own payslips
const getPayslips = (req, res) => {
  let sql = `
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
      p.generated_on,
      p.status
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
  `;

  const values = [];

  if (req.user.role !== "admin") {
    sql += " WHERE p.employee_id = ?";
    values.push(req.user.employee_id);
  }

  sql += " ORDER BY p.generated_on DESC";

  db.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch payslips",
      });
    }

    res.status(200).json(result);
  });
};

// Individual payslip details
const getPayslipById = (req, res) => {
  const { id } = req.params;

  let sql = `
    SELECT 
      p.*,
      e.full_name,
      e.email,
      e.department,
      e.designation,
      ss.basic_salary,
      ss.hra,
      ss.allowances,
      ss.deductions,
      ss.net_salary,
      ss.effective_from
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    JOIN salary_structures ss ON p.salary_structure_id = ss.id
    WHERE p.id = ?
  `;

  const values = [id];

  if (req.user.role !== "admin") {
    sql += " AND p.employee_id = ?";
    values.push(req.user.employee_id);
  }

  db.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch payslip details",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Payslip not found",
      });
    }

    res.status(200).json(result[0]);
  });
};

// Payroll dashboard summary
const getPayrollSummary = (req, res) => {
  const monthlySql = `
    SELECT 
      pay_month,
      SUM(final_amount_paid) AS total_payroll
    FROM payslips
    WHERE status = 'Paid'
    GROUP BY pay_month
    ORDER BY MIN(generated_on)
  `;

  const departmentSql = `
    SELECT 
      e.department,
      SUM(p.final_amount_paid) AS total_spend
    FROM payslips p
    JOIN employees e ON p.employee_id = e.id
    WHERE p.status = 'Paid'
    GROUP BY e.department
  `;

  const kpiSql = `
    SELECT
      COALESCE(SUM(CASE WHEN pay_month = DATE_FORMAT(CURDATE(), '%M %Y') AND status = 'Paid' THEN final_amount_paid ELSE 0 END), 0) AS total_payroll_this_month,
      COUNT(*) AS payslips_generated,
      SUM(CASE WHEN status = 'Generated' THEN 1 ELSE 0 END) AS payslips_pending
    FROM payslips
  `;

  db.query(monthlySql, (monthlyError, monthlyResult) => {
    if (monthlyError) {
      return res.status(500).json({
        message: "Failed to fetch monthly payroll summary",
      });
    }

    db.query(departmentSql, (departmentError, departmentResult) => {
      if (departmentError) {
        return res.status(500).json({
          message: "Failed to fetch department payroll summary",
        });
      }

      db.query(kpiSql, (kpiError, kpiResult) => {
        if (kpiError) {
          return res.status(500).json({
            message: "Failed to fetch payroll KPI summary",
          });
        }

        res.status(200).json({
          byMonth: monthlyResult,
          byDepartment: departmentResult,
          kpis: kpiResult[0],
        });
      });
    });
  });
};

module.exports = {
  setSalaryStructure,
  getSalaryStructure,
  generatePayslip,
  getPayslips,
  getPayslipById,
  getPayrollSummary,
};
