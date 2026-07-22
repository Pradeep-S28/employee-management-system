import { useState } from "react";

const initialForm = {
  category: "",
  subject: "",
  description: "",
  priority: "Medium",
};

const categories = ["HR", "IT", "Payroll", "Administration"];
const priorities = ["Low", "Medium", "High"];

const ServiceRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!priorities.includes(formData.priority)) {
      newErrors.priority = "Priority must be Low, Medium, or High";
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
      <h5>Raise a Service Request</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <small className="text-danger">{errors.category}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {errors.priority && (
              <small className="text-danger">{errors.priority}</small>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Subject</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Brief summary of the issue"
              value={formData.subject}
              onChange={handleChange}
            />
            {errors.subject && (
              <small className="text-danger">{errors.subject}</small>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Describe the issue in detail"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <small className="text-danger">{errors.description}</small>
            )}
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-primary" type="submit">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
