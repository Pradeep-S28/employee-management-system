import { useMemo, useState } from "react";

const PayslipTable = ({ payslips, onRowClick, isAdmin }) => {
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const departments = useMemo(() => {
    return [
      ...new Set(payslips.map((payslip) => payslip.department).filter(Boolean)),
    ];
  }, [payslips]);

  const months = useMemo(() => {
    return [
      ...new Set(payslips.map((payslip) => payslip.pay_month).filter(Boolean)),
    ];
  }, [payslips]);

  const filteredPayslips = useMemo(() => {
    return payslips.filter((payslip) => {
      const matchesMonth = !monthFilter || payslip.pay_month === monthFilter;

      const matchesStatus = !statusFilter || payslip.status === statusFilter;

      const matchesDepartment =
        !departmentFilter || payslip.department === departmentFilter;

      return matchesMonth && matchesStatus && matchesDepartment;
    });
  }, [payslips, monthFilter, statusFilter, departmentFilter]);

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">
        {isAdmin ? "All Payslips" : "My Payslip History"}
      </h5>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
          >
            <option value="">All Months</option>

            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Generated">Generated</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {isAdmin && (
          <div className="col-md-4">
            <select
              className="form-select"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <option value="">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>

              {isAdmin && (
                <>
                  <th>Employee</th>
                  <th>Department</th>
                </>
              )}

              <th>Pay Month</th>
              <th>Days Worked</th>
              <th>Leave Deduction</th>
              <th>Final Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayslips.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 7} className="text-center">
                  No payslips found
                </td>
              </tr>
            ) : (
              filteredPayslips.map((payslip) => (
                <tr
                  key={payslip.id}
                  onClick={() => onRowClick(payslip.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{payslip.id}</td>

                  {isAdmin && (
                    <>
                      <td>{payslip.full_name}</td>
                      <td>{payslip.department}</td>
                    </>
                  )}

                  <td>{payslip.pay_month}</td>
                  <td>{payslip.days_worked}</td>

                  <td>
                    ₹{Number(payslip.leave_deductions).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹{Number(payslip.final_amount_paid).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        payslip.status === "Paid"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {payslip.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <small className="text-muted">
        Click a row to view complete payslip details.
      </small>
    </div>
  );
};

export default PayslipTable;
