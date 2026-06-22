const DashboardCards = ({ employees }) => {
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active",
  ).length;

  const onLeaveEmployees = employees.filter(
    (employee) => employee.status === "On Leave",
  ).length;

  const departmentsCount = new Set(
    employees.map((employee) => employee.department),
  ).size;

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3 col-sm-6">
        <div className="summary-card">
          <p>Total Employees</p>
          <h3>{totalEmployees}</h3>
        </div>
      </div>

      <div className="col-md-3 col-sm-6">
        <div className="summary-card">
          <p>Active Employees</p>
          <h3>{activeEmployees}</h3>
        </div>
      </div>

      <div className="col-md-3 col-sm-6">
        <div className="summary-card">
          <p>On Leave</p>
          <h3>{onLeaveEmployees}</h3>
        </div>
      </div>

      <div className="col-md-3 col-sm-6">
        <div className="summary-card">
          <p>Departments</p>
          <h3>{departmentsCount}</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
