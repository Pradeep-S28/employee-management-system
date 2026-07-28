import { useState } from "react";

const CertificationView = ({
  isAdmin,
  employees,
  programs,
  certifications,
  onGenerate,
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!employeeId || !trainingId) {
      setError("Employee and training program are required");
      return;
    }

    setError("");

    const success = await onGenerate({
      employee_id: employeeId,
      training_id: trainingId,
      expiry_date: expiryDate || null,
    });

    if (success) {
      setEmployeeId("");
      setTrainingId("");
      setExpiryDate("");
    }
  };

  return (
    <div className="mb-4">
      {isAdmin && (
        <div className="card p-3 mb-4">
          <h5>Generate Certification</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Employee</label>
                <select
                  className="form-select"
                  value={employeeId}
                  onChange={(event) => setEmployeeId(event.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name} ({employee.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Training Program</label>
                <select
                  className="form-select"
                  value={trainingId}
                  onChange={(event) => setTrainingId(event.target.value)}
                >
                  <option value="">Select Training</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.training_title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
                />
              </div>
            </div>

            <small className="text-muted d-block mt-2">
              A certificate can only be generated after the employee has passed
              the assessment for this training program.
            </small>

            {error && <div className="text-danger mt-2">{error}</div>}

            <div className="mt-3">
              <button className="btn btn-primary" type="submit">
                Generate Certificate
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <h5 className="mb-3">
          {isAdmin ? "All Certifications" : "My Certifications"}
        </h5>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                {isAdmin && <th>Employee</th>}
                <th>Training</th>
                <th>Certificate Number</th>
                <th>Issued Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>

            <tbody>
              {certifications.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center">
                    No certifications found
                  </td>
                </tr>
              ) : (
                certifications.map((certification) => (
                  <tr key={certification.id}>
                    {isAdmin && (
                      <td>
                        {certification.employee_name} (
                        {certification.department})
                      </td>
                    )}
                    <td>{certification.training_title}</td>
                    <td>{certification.certificate_number}</td>
                    <td>{certification.issued_date?.slice(0, 10)}</td>
                    <td>{certification.expiry_date?.slice(0, 10) || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CertificationView;
