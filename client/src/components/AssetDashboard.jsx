import AssetCharts from "./AssetCharts";

const AssetDashboard = ({ dashboard, loading }) => {
  const cards = dashboard?.cards || {};

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading asset dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Asset Dashboard</h4>

      <div className="row">
        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Assets</h6>
              <h3>{cards.totalAssets || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Available</h6>
              <h3 className="text-success">{cards.availableAssets || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Assigned</h6>
              <h3 className="text-primary">{cards.assignedAssets || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Under Maintenance</h6>
              <h3 className="text-warning">
                {cards.underMaintenanceAssets || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Due for Return (7 days)</h6>
              <h3 className="text-danger">{cards.assetsDueForReturn || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <AssetCharts
        categoryDistribution={dashboard?.categoryDistribution || []}
        statusOverview={dashboard?.statusOverview || []}
        monthlyAssignments={dashboard?.monthlyAssignments || []}
        departmentAllocation={dashboard?.departmentAllocation || []}
      />
    </div>
  );
};

export default AssetDashboard;
