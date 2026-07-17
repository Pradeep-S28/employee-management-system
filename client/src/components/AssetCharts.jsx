import RatingChart from "./RatingChart";

// Task 10 dashboard charts: category distribution, status overview,
// monthly assignments, department-wise allocation.
// Reuses the generic RatingChart card built for Task 9 so we don't
// duplicate the ResponsiveContainer/recharts boilerplate again.
const AssetCharts = ({
  categoryDistribution = [],
  statusOverview = [],
  monthlyAssignments = [],
  departmentAllocation = [],
}) => {
  return (
    <div className="row">
      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Asset Distribution by Category"
          type="pie"
          data={categoryDistribution}
          dataKey="count"
          nameKey="category"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Asset Status Overview"
          type="bar"
          data={statusOverview}
          dataKey="count"
          nameKey="status"
          seriesName="Assets"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Monthly Asset Assignments"
          type="line"
          data={monthlyAssignments}
          dataKey="count"
          nameKey="month"
          seriesName="Assignments"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Department-wise Asset Allocation"
          type="bar"
          data={departmentAllocation}
          dataKey="count"
          nameKey="department"
          seriesName="Assets Allocated"
        />
      </div>
    </div>
  );
};

export default AssetCharts;
