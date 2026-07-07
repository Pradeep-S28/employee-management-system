import { useMemo, useState } from "react";

const initialForm = {
  employee_id: "",
  basic_salary: "",
  hra: "",
  allowances: "",
  deductions: "",
  effective_from: "",
};

const SalaryForm = ({ employees, onSubmit, loading }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const netSalary = useMemo(() => {
    const basicSalary = Number(formData.basic_salary) || 0;
    const hra = Number(formData.hra) || 0;
    const allowances = Number(formData.allowances) || 0;
    const deductions = Number(formData.deductions) || 0;

    return basicSalary + hra + allowances - deductions;
  }, [
    formData.basic_salary,
    formData.hra,
    formData.allowances,
    formData.deductions,
  ]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = "Employee is required";
    }

    const salaryFields = ["basic_salary", "hra", "allowances", "deductions"];

    salaryFields.forEach((field) => {
      if (formData[field] === "") {
        newErrors[field] = "This field is required";
      } else if (Number(formData[field]) < 0) {
        newErrors[field] = "Value cannot be negative";
      }
    });

    if (netSalary < 0) {
      newErrors.net_salary = "Deductions cannot be greater than total earnings";
    }

    if (!formData.effective_from) {
      newErrors.effective_from = "Effective date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const salaryData = {
      employee_id: Number(formData.employee_id),
      basic_salary: Number(formData.basic_salary),
      hra: Number(formData.hra),
      allowances: Number(formData.allowances),
      deductions: Number(formData.deductions),
      effective_from: formData.effective_from,
    };

    const success = await onSubmit(salaryData);

    if (success) {
      setFormData(initialForm);
      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">Salary Configuration</h5>

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
          </div>

          <div className="col-md-6">
            <label className="form-label">Effective From</label>

            <input
              type="date"
              name="effective_from"
              className="form-control"
              value={formData.effective_from}
              onChange={handleChange}
            />

            {errors.effective_from && (
              <small className="text-danger">{errors.effective_from}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Basic Salary</label>

            <input
              type="number"
              name="basic_salary"
              className="form-control"
              min="0"
              value={formData.basic_salary}
              onChange={handleChange}
            />

            {errors.basic_salary && (
              <small className="text-danger">{errors.basic_salary}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">HRA</label>

            <input
              type="number"
              name="hra"
              className="form-control"
              min="0"
              value={formData.hra}
              onChange={handleChange}
            />

            {errors.hra && <small className="text-danger">{errors.hra}</small>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Allowances</label>

            <input
              type="number"
              name="allowances"
              className="form-control"
              min="0"
              value={formData.allowances}
              onChange={handleChange}
            />

            {errors.allowances && (
              <small className="text-danger">{errors.allowances}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Deductions</label>

            <input
              type="number"
              name="deductions"
              className="form-control"
              min="0"
              value={formData.deductions}
              onChange={handleChange}
            />

            {errors.deductions && (
              <small className="text-danger">{errors.deductions}</small>
            )}
          </div>

          <div className="col-12">
            <div className="alert alert-info mb-0">
              <strong>Net Salary:</strong> ₹{netSalary.toLocaleString("en-IN")}
            </div>

            {errors.net_salary && (
              <small className="text-danger">{errors.net_salary}</small>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Salary Structure"}
        </button>
      </form>
    </div>
  );
};

export default SalaryForm;
