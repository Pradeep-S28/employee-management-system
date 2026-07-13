import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getReportsDashboard } from "../services/api";

const DashboardReports = ({ token }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getReportsDashboard(token);
        setReportData(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load reports dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardReports();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading reports dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const { summary, charts } = reportData;

  const cards = [
    {
      title: "Total Employees",
      value: summary.totalEmployees,
    },
    {
      title: "Active Employees",
      value: summary.activeEmployees,
    },
    {
      title: "Employees on Leave",
      value: summary.employeesOnLeave,
    },
    {
      title: "Total Payroll Processed",
      value: `₹${Number(summary.totalPayrollProcessed).toLocaleString(
        "en-IN",
      )}`,
    },
    {
      title: "Pending Leave Requests",
      value: summary.pendingLeaveRequests,
    },
    {
      title: "Monthly Attendance",
      value: `${summary.monthlyAttendancePercentage}%`,
    },
  ];

  return (
    <div className="mb-4">
      <h3 className="mb-4">Reports Dashboard</h3>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-md-6 col-lg-4" key={card.title}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-muted mb-2">{card.title}</p>
                <h3 className="mb-0">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Leave Distribution by Type</h5>

              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={charts.leaveDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Department-wise Employee Count</h5>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={charts.departmentEmployeeCount}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Payroll Distribution by Department</h5>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={charts.departmentPayrollDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Monthly Attendance Trend</h5>

              {charts.attendanceTrend.length === 0 ? (
                <div className="alert alert-info mt-4">
                  Attendance data will appear after the attendance module is
                  added.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={charts.attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReports;
