import RatingChart from "./RatingChart";

// Task 12 dashboard charts: applications by department, candidate status
// distribution, monthly hiring trend, onboarding completion. Reuses the
// generic RatingChart card built for Task 9 so we don't duplicate the
// ResponsiveContainer/recharts boilerplate again.
const RecruitmentCharts = ({
  applicationsByDepartment = [],
  candidateStatusDistribution = [],
  monthlyHiringTrend = [],
  onboardingCompletion = [],
}) => {
  return (
    <div className="row">
      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Applications by Department"
          type="bar"
          data={applicationsByDepartment}
          dataKey="count"
          nameKey="department"
          seriesName="Applications"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Candidate Status Distribution"
          type="pie"
          data={candidateStatusDistribution}
          dataKey="count"
          nameKey="status"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Monthly Hiring Trend"
          type="line"
          data={monthlyHiringTrend}
          dataKey="count"
          nameKey="month"
          seriesName="Hired"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Onboarding Completion"
          type="pie"
          data={onboardingCompletion}
          dataKey="count"
          nameKey="status"
        />
      </div>
    </div>
  );
};

export default RecruitmentCharts;
