import { useEffect, useState } from "react";

const initialForm = {
  full_name: "",
  email: "",
  phone_number: "",
  job_id: "",
  resume_path: "",
};

const statuses = [
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Rejected",
  "Hired",
];

// Doubles as the "Add New Candidate" form (when no candidate is passed) and
// the candidate detail / status-update view (when a candidate is passed),
// matching the CandidateDetails.jsx entry from the Task 12 folder structure.
const CandidateDetails = ({
  candidate,
  jobs,
  onAddCandidate,
  onUpdateCandidate,
  onClose,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(candidate?.application_status || "Applied");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(candidate?.application_status || "Applied");
  }, [candidate]);

  const openJobs = jobs.filter((job) => job.status === "Open");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "Phone number is required";
    if (!formData.job_id) newErrors.job_id = "Please select a job opening";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const success = await onAddCandidate(formData);

    if (success) {
      setFormData(initialForm);
      setErrors({});
    }
  };

  const handleStatusSave = async () => {
    setSaving(true);
    await onUpdateCandidate(candidate.id, { application_status: status });
    setSaving(false);
  };

  // Add-new-candidate mode
  if (!candidate) {
    return (
      <div className="card p-3 mb-4">
        <h5>Add New Candidate Application</h5>

        <form onSubmit={handleAddSubmit}>
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
                type="email"
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
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                className="form-control"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <small className="text-danger">{errors.phone_number}</small>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Applied Position</label>
              <select
                name="job_id"
                className="form-select"
                value={formData.job_id}
                onChange={handleChange}
              >
                <option value="">Select Job Opening</option>
                {openJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.job_title} ({job.department})
                  </option>
                ))}
              </select>
              {errors.job_id && (
                <small className="text-danger">{errors.job_id}</small>
              )}
            </div>

            <div className="col-md-12">
              <label className="form-label">Resume Path / URL</label>
              <input
                type="text"
                name="resume_path"
                className="form-control"
                placeholder="https://..."
                value={formData.resume_path}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary" type="submit">
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View / update mode
  const isHired = candidate.application_status === "Hired";

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Candidate: {candidate.full_name}</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <strong>Email</strong>
          <div>{candidate.email}</div>
        </div>

        <div className="col-md-4">
          <strong>Phone</strong>
          <div>{candidate.phone_number}</div>
        </div>

        <div className="col-md-4">
          <strong>Applied Position</strong>
          <div>
            {candidate.job_title} ({candidate.department})
          </div>
        </div>

        <div className="col-md-4">
          <strong>Applied On</strong>
          <div>{candidate.applied_date?.slice(0, 10)}</div>
        </div>

        <div className="col-md-4">
          <strong>Resume</strong>
          <div>
            {candidate.resume_path ? (
              <a href={candidate.resume_path} target="_blank" rel="noreferrer">
                View Resume
              </a>
            ) : (
              "-"
            )}
          </div>
        </div>

        <div className="col-md-4">
          <strong>Current Status</strong>
          <div>{candidate.application_status}</div>
        </div>
      </div>

      <div className="card p-3 mt-3 bg-light">
        <h6>Update Candidate Status</h6>

        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <select
              className="form-select"
              value={status}
              disabled={isHired}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={isHired || saving}
              onClick={handleStatusSave}
            >
              {saving ? "Saving..." : "Save Status"}
            </button>
          </div>
        </div>

        {isHired && (
          <small className="text-success d-block mt-2">
            This candidate has been hired and converted into an employee
            record.
          </small>
        )}

        {!isHired && status === "Hired" && (
          <small className="text-muted d-block mt-2">
            Saving as &quot;Hired&quot; will automatically create a new
            employee record for this candidate.
          </small>
        )}
      </div>
    </div>
  );
};

export default CandidateDetails;
