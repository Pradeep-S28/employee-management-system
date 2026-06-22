const EmployeeDetails = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="details-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Employee Details</h5>
          <button className="btn btn-sm btn-danger" onClick={onClose}>
            X
          </button>
        </div>

        <p>
          <strong>ID:</strong> {employee.id}
        </p>
        <p>
          <strong>Full Name:</strong> {employee.full_name}
        </p>
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>Department:</strong> {employee.department}
        </p>
        <p>
          <strong>Designation:</strong> {employee.designation}
        </p>
        <p>
          <strong>Status:</strong> {employee.status}
        </p>
        <p>
          <strong>Date of Joining:</strong>{" "}
          {employee.date_of_joining?.slice(0, 10)}
        </p>
      </div>
    </div>
  );
};

export default EmployeeDetails;
