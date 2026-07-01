import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ReportCharts = ({ employees, leaveSummary, loading }) => {
  const departmentData = Object.values(
    employees.reduce((acc, employee) => {
      const department = employee.department || "Unknown";

      if (!acc[department]) {
        acc[department] = {
          name: department,
          value: 0,
        };
      }

      acc[department].value += 1;
      return acc;
    }, {}),
  );

  const statusData = ["Pending", "Approved", "Rejected"].map((status) => {
    const item = leaveSummary.byStatus?.find((row) => row.status === status);

    return {
      status,
      count: item ? item.count : 0,
    };
  });

  const typeData = ["Sick", "Casual", "Paid"].map((type) => {
    const item = leaveSummary.byType?.find((row) => row.leave_type === type);

    return {
      type,
      count: item ? item.count : 0,
    };
  });

  if (loading) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2 mb-0">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title">Employees by Department</h5>

            {departmentData.length === 0 ? (
              <p className="text-muted">No employee data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={index} />
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

      <div className="col-lg-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title">Leave Requests by Status</h5>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title">Leave Requests by Type</h5>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;
