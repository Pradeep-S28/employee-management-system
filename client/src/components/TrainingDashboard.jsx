import TrainingCharts from "./TrainingCharts";

const TrainingDashboard = ({ dashboard, loading }) => {
  const cards = dashboard?.cards || {};

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading training dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Training Dashboard</h4>

      <div className="row">
        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Programs</h6>
              <h3>{cards.totalPrograms || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Active Trainings</h6>
              <h3>{cards.activeTrainings || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Completed Trainings</h6>
              <h3>{cards.completedTrainings || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Employees Certified</h6>
              <h3>{cards.employeesCertified || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Pending Assessments</h6>
              <h3>{cards.pendingAssessments || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <TrainingCharts dashboard={dashboard} />
    </div>
  );
};

export default TrainingDashboard;
