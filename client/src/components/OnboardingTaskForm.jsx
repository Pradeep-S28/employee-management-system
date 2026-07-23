import { useState } from "react";

const initialForm = {
  employee_id: "",
  task_name: "",
  due_date: "",
};

const OnboardingTaskForm = ({ employees, onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) newErrors.employee_id = "Employee is required";
    if (!formData.task_name.trim())
      newErrors.task_name = "Task name is required";
    if (!formData.due_date) newErrors.due_date = "Due date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const success = await onSubmit(formData);

    if (success) {
      setFormData(initialForm);
      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Assign Onboarding Task</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
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
                  {employee.full_name} ({employee.department})
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <small className="text-danger">{errors.employee_id}</small>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Task Name</label>
            <input
              type="text"
              name="task_name"
              className="form-control"
              placeholder="e.g. Complete HR documentation"
              value={formData.task_name}
              onChange={handleChange}
            />
            {errors.task_name && (
              <small className="text-danger">{errors.task_name}</small>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              name="due_date"
              className="form-control"
              value={formData.due_date}
              onChange={handleChange}
            />
            {errors.due_date && (
              <small className="text-danger">{errors.due_date}</small>
            )}
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-primary" type="submit">
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingTaskForm;
