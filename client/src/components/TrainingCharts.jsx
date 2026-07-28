import RatingChart from "./RatingChart";

// Charts for the Training & Learning dashboard. Reuses the generic
// RatingChart card used by the Performance module's dashboard.
const TrainingCharts = ({ dashboard }) => {
  const completionByDepartment = dashboard?.completionByDepartment || [];
  const monthlyCertifications = dashboard?.monthlyCertifications || [];
  const categoryDistribution = dashboard?.categoryDistribution || [];
  const employeeProgressOverview = dashboard?.employeeProgressOverview || [];

  return (
    <div className="row">
      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Training Completion by Department"
          type="bar"
          data={completionByDepartment}
          dataKey="completion_rate"
          nameKey="department"
          seriesName="Completion %"
          yDomain={[0, 100]}
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Monthly Certification Count"
          type="line"
          data={monthlyCertifications}
          dataKey="count"
          nameKey="month"
          seriesName="Certifications"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Training Category Distribution"
          type="pie"
          data={categoryDistribution}
          dataKey="count"
          nameKey="category"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Employee Progress Overview"
          type="bar"
          data={employeeProgressOverview}
          dataKey="avg_progress"
          nameKey="training_title"
          seriesName="Avg Progress %"
          yDomain={[0, 100]}
        />
      </div>
    </div>
  );
};

export default TrainingCharts;
