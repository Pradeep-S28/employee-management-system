import { useMemo, useState } from "react";

const initialForm = {
  employee_id: "",
  pay_month: "",
  days_worked: "",
  leave_deductions: "",
  status: "Generated",
};

const PayslipGenerator = ({
  employees,
  selectedSalary,
  onEmployeeChange,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const finalAmount = useMemo(() => {
    if (!selectedSalary) return 0;

    return (
      Number(selectedSalary.net_salary || 0) -
      Number(formData.leave_deductions || 0)
    );
  }, [selectedSalary, formData.leave_deductions]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = "Employee is required";
    }

    if (!formData.pay_month) {
      newErrors.pay_month = "Pay month is required";
    }

    if (formData.days_worked === "") {
      newErrors.days_worked = "Days worked is required";
    } else if (Number(formData.days_worked) < 0) {
      newErrors.days_worked = "Days worked cannot be negative";
    }

    if (formData.leave_deductions === "") {
      newErrors.leave_deductions = "Leave deductions is required";
    } else if (Number(formData.leave_deductions) < 0) {
      newErrors.leave_deductions = "Leave deductions cannot be negative";
    }

    if (!selectedSalary) {
      newErrors.salary = "Salary structure not found for this employee";
    }

    if (finalAmount < 0) {
      newErrors.final_amount = "Leave deductions cannot exceed net salary";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (name === "employee_id") {
      onEmployeeChange(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payslipData = {
      employee_id: Number(formData.employee_id),
      pay_month: formData.pay_month,
      days_worked: Number(formData.days_worked),
      leave_deductions: Number(formData.leave_deductions),
      status: formData.status,
    };

    const success = await onSubmit(payslipData);

    if (success) {
      setFormData(initialForm);
      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">Generate Payslip</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Employee</label>

            <select
              name="employee_id"
              className="form-select"
              value={formData.employee_id}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name} - {employee.department}
                </option>
              ))}
            </select>

            {errors.employee_id && (
              <small className="text-danger">{errors.employee_id}</small>
            )}

            {errors.salary && (
              <small className="text-danger d-block">{errors.salary}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Pay Month</label>

            <input
              type="month"
              name="pay_month"
              className="form-control"
              value={formData.pay_month}
              onChange={handleChange}
            />

            {errors.pay_month && (
              <small className="text-danger">{errors.pay_month}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Days Worked</label>

            <input
              type="number"
              name="days_worked"
              className="form-control"
              min="0"
              value={formData.days_worked}
              onChange={handleChange}
            />

            {errors.days_worked && (
              <small className="text-danger">{errors.days_worked}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Leave Deductions</label>

            <input
              type="number"
              name="leave_deductions"
              className="form-control"
              min="0"
              value={formData.leave_deductions}
              onChange={handleChange}
            />

            {errors.leave_deductions && (
              <small className="text-danger">{errors.leave_deductions}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>

            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Generated">Generated</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Net Salary</label>

            <input
              type="text"
              className="form-control"
              value={
                selectedSalary
                  ? `₹${Number(selectedSalary.net_salary).toLocaleString(
                      "en-IN",
                    )}`
                  : "Select employee"
              }
              readOnly
            />
          </div>

          <div className="col-12">
            <div className="alert alert-info mb-0">
              <strong>Final Amount:</strong> ₹
              {finalAmount.toLocaleString("en-IN")}
            </div>

            {errors.final_amount && (
              <small className="text-danger">{errors.final_amount}</small>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-success mt-3"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Payslip"}
        </button>
      </form>
    </div>
  );
};

export default PayslipGenerator;
