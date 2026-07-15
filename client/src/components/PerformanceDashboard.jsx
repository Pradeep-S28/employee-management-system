import RatingChart from "./RatingChart";

const PerformanceDashboard = ({ dashboard, loading }) => {
  const cards = dashboard?.cards || {};
  const departmentWiseAvgRating = dashboard?.departmentWiseAvgRating || [];
  const monthlyCompletedReviews = dashboard?.monthlyCompletedReviews || [];
  const ratingDistribution = dashboard?.ratingDistribution || [];
  const topPerformingDepartments = dashboard?.topPerformingDepartments || [];

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading performance dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Performance Dashboard</h4>

      <div className="row">
        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Reviews</h6>
              <h3>{cards.totalReviews || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Pending Reviews</h6>
              <h3>{cards.pendingReviews || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Completed Reviews</h6>
              <h3>{cards.completedReviews || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Average Rating</h6>
              <h3>{cards.averageRating || "-"}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <RatingChart
            title="Department-wise Average Rating"
            type="bar"
            data={departmentWiseAvgRating}
            dataKey="avg_rating"
            nameKey="department"
            seriesName="Average Rating"
            yDomain={[0, 5]}
          />
        </div>

        <div className="col-lg-6 mb-4">
          <RatingChart
            title="Rating Distribution"
            type="pie"
            data={ratingDistribution}
            dataKey="count"
            nameKey="rating"
          />
        </div>

        <div className="col-lg-6 mb-4">
          <RatingChart
            title="Monthly Completed Reviews"
            type="line"
            data={monthlyCompletedReviews}
            dataKey="count"
            nameKey="month"
            seriesName="Completed Reviews"
          />
        </div>

        <div className="col-lg-6 mb-4">
          <RatingChart
            title="Top Performing Departments"
            type="bar"
            data={topPerformingDepartments}
            dataKey="avg_rating"
            nameKey="department"
            seriesName="Average Rating"
            yDomain={[0, 5]}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
