import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PerformanceCharts = ({ summary }) => {
  const avgRatingByDepartment = summary?.avgRatingByDepartment || [];
  const ratingDistribution = summary?.ratingDistribution || [];
  const reviewTrend = summary?.reviewTrend || [];

  const pieColors = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

  return (
    <div className="mb-4">
      <h4 className="mb-3">Performance Dashboard</h4>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Reviewed</h6>
              <h3>
                {ratingDistribution.reduce(
                  (total, item) => total + Number(item.count),
                  0,
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Departments Reviewed</h6>
              <h3>{avgRatingByDepartment.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Review Periods</h6>
              <h3>{reviewTrend.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h6 className="mb-0">Average Rating by Department</h6>
            </div>

            <div className="card-body" style={{ height: "300px" }}>
              {avgRatingByDepartment.length === 0 ? (
                <p className="text-center text-muted mt-5">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={avgRatingByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg_rating" name="Average Rating" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h6 className="mb-0">Rating Distribution</h6>
            </div>

            <div className="card-body" style={{ height: "300px" }}>
              {ratingDistribution.length === 0 ? (
                <p className="text-center text-muted mt-5">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      dataKey="count"
                      nameKey="rating"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.rating}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h6 className="mb-0">Performance Trend</h6>
            </div>

            <div className="card-body" style={{ height: "300px" }}>
              {reviewTrend.length === 0 ? (
                <p className="text-center text-muted mt-5">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reviewTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="review_period" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avg_rating"
                      name="Average Rating"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
