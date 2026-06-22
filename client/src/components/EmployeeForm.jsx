import { useEffect, useState } from "react";

const initialForm = {
  full_name: "",
  email: "",
  department: "",
  designation: "",
  date_of_joining: "",
  status: "Active",
};

const EmployeeForm = ({ onSubmit, editingEmployee, onCancel }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const departments = ["Engineering", "HR", "Finance", "Marketing", "Sales"];

  const designations = [
    "Software Developer",
    "Frontend Developer",
    "Backend Developer",
    "HR Executive",
    "Accountant",
    "Marketing Executive",
    "Sales Executive",
    "MERN Developer",
  ];

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        full_name: editingEmployee.full_name || "",
        email: editingEmployee.email || "",
        department: editingEmployee.department || "",
        designation: editingEmployee.designation || "",
        date_of_joining: editingEmployee.date_of_joining?.slice(0, 10) || "",
        status: editingEmployee.status || "Active",
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [editingEmployee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.date_of_joining) {
      newErrors.date_of_joining = "Date of joining is required";
    } else {
      const today = new Date();
      const joiningDate = new Date(formData.date_of_joining);

      if (joiningDate > today) {
        newErrors.date_of_joining = "Date cannot be in the future";
      }
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialForm);
      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{editingEmployee ? "Edit Employee" : "Add Employee"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-control"
              value={formData.full_name}
              onChange={handleChange}
            />
            {errors.full_name && (
              <small className="text-danger">{errors.full_name}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="text"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && (
              <small className="text-danger">{errors.department}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <select
              name="designation"
              className="form-select"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>
              {designations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
            {errors.designation && (
              <small className="text-danger">{errors.designation}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Date of Joining</label>
            <input
              type="date"
              name="date_of_joining"
              className="form-control"
              value={formData.date_of_joining}
              onChange={handleChange}
            />
            {errors.date_of_joining && (
              <small className="text-danger">{errors.date_of_joining}</small>
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
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <small className="text-danger">{errors.status}</small>
            )}
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </button>

          {editingEmployee && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
