import { useEffect, useState } from "react";

const initialForm = {
  job_title: "",
  department: "",
  location: "",
  employment_type: "Full-Time",
  number_of_openings: 1,
  status: "Open",
};

const JobOpeningForm = ({ onSubmit, editingJob, onCancel }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingJob) {
      setFormData({
        job_title: editingJob.job_title || "",
        department: editingJob.department || "",
        location: editingJob.location || "",
        employment_type: editingJob.employment_type || "Full-Time",
        number_of_openings: editingJob.number_of_openings || 1,
        status: editingJob.status || "Open",
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [editingJob]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.job_title.trim()) {
      newErrors.job_title = "Job title is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (Number(formData.number_of_openings) <= 0) {
      newErrors.number_of_openings = "Number of openings must be at least 1";
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

      if (!editingJob) {
        setFormData(initialForm);
      }

      setErrors({});
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5>{editingJob ? "Edit Job Opening" : "Add New Job Opening"}</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="job_title"
              className="form-control"
              value={formData.job_title}
              onChange={handleChange}
            />
            {errors.job_title && (
              <small className="text-danger">{errors.job_title}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && (
              <small className="text-danger">{errors.department}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && (
              <small className="text-danger">{errors.location}</small>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Employment Type</label>
            <select
              name="employment_type"
              className="form-select"
              value={formData.employment_type}
              onChange={handleChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Number of Openings</label>
            <input
              type="number"
              min="1"
              name="number_of_openings"
              className="form-control"
              value={formData.number_of_openings}
              onChange={handleChange}
            />
            {errors.number_of_openings && (
              <small className="text-danger">
                {errors.number_of_openings}
              </small>
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
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            <small className="text-muted">
              Closed job openings stop accepting new candidate applications.
            </small>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingJob ? "Update Job" : "Add Job"}
          </button>

          {editingJob && (
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

export default JobOpeningForm;
