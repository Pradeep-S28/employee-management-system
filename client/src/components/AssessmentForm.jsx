import { useState } from "react";

const AssessmentForm = ({
  employees,
  programs,
  onSubmit,
  assessments,
  assessmentsLoading,
  onEmployeeChange,
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");

  const handleEmployeeSelect = (value) => {
    setEmployeeId(value);
    if (value) onEmployeeChange(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!employeeId || !trainingId || score === "") {
      setError("Employee, training program, and score are required");
      return;
    }

    if (Number(score) < 0 || Number(score) > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    setError("");
    onSubmit({
      employee_id: employeeId,
      training_id: trainingId,
      score: Number(score),
    });
    setTrainingId("");
    setScore("");
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Record Assessment Result</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={employeeId}
              onChange={(event) => handleEmployeeSelect(event.target.value)}
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
            <label className="form-label">Score (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control"
              value={score}
              onChange={(event) => setScore(event.target.value)}
            />
          </div>
        </div>

        {error && <div className="text-danger mt-2">{error}</div>}

        <div className="mt-3">
          <button className="btn btn-primary" type="submit">
            Record Result
          </button>
        </div>
      </form>

      {employeeId && (
        <>
          <h6 className="mt-4">Assessment History</h6>

          {assessmentsLoading ? (
            <div className="text-center my-3">
              Loading assessment history...
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Training</th>
                    <th>Score</th>
                    <th>Result</th>
                    <th>Attempt Date</th>
                  </tr>
                </thead>
                <tbody>
                  {!assessments || assessments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No assessment attempts found
                      </td>
                    </tr>
                  ) : (
                    assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td>{assessment.training_title}</td>
                        <td>{assessment.score}</td>
                        <td>
                          <span
                            className={`badge ${
                              assessment.result === "Pass"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {assessment.result}
                          </span>
                        </td>
                        <td>{assessment.attempt_date?.slice(0, 10)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssessmentForm;
