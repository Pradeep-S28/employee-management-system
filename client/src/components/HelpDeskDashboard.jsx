import TicketCharts from "./TicketCharts";

const HelpDeskDashboard = ({ dashboard, loading }) => {
  const cards = dashboard?.cards || {};

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading help desk dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Help Desk Dashboard</h4>

      <div className="row">
        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Requests</h6>
              <h3>{cards.totalRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Open</h6>
              <h3 className="text-secondary">{cards.openRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>In Progress</h6>
              <h3 className="text-primary">{cards.inProgressRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Resolved</h6>
              <h3 className="text-success">{cards.resolvedRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Closed</h6>
              <h3 className="text-dark">{cards.closedRequests || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-2 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Avg. Resolution</h6>
              <h3 className="text-info">
                {cards.avgResolutionHours || 0}
                <small className="fs-6"> hrs</small>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <TicketCharts
        categoryDistribution={dashboard?.categoryDistribution || []}
        priorityDistribution={dashboard?.priorityDistribution || []}
        monthlyTrend={dashboard?.monthlyTrend || []}
      />
    </div>
  );
};

export default HelpDeskDashboard;
