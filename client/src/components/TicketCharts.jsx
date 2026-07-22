import RatingChart from "./RatingChart";

// Task 11 dashboard charts: category distribution, priority distribution,
// and monthly ticket trends. Reuses the generic RatingChart component
// built for Task 9 / reused in Task 10.
const TicketCharts = ({
  categoryDistribution = [],
  priorityDistribution = [],
  monthlyTrend = [],
}) => {
  return (
    <div className="row">
      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Requests by Category"
          type="pie"
          data={categoryDistribution}
          dataKey="count"
          nameKey="category"
        />
      </div>

      <div className="col-lg-6 mb-4">
        <RatingChart
          title="Requests by Priority"
          type="bar"
          data={priorityDistribution}
          dataKey="count"
          nameKey="priority"
          seriesName="Requests"
        />
      </div>

      <div className="col-lg-12 mb-4">
        <RatingChart
          title="Monthly Ticket Trends"
          type="line"
          data={monthlyTrend}
          dataKey="count"
          nameKey="month"
          seriesName="Requests"
        />
      </div>
    </div>
  );
};

export default TicketCharts;
