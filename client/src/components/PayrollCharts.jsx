import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

const PayrollCharts = ({ summary }) => {
  const monthlyData = summary?.byMonth || [];
  const departmentData = summary?.byDepartment || [];
  const kpis = summary?.kpis || {};

  return (
    <div className="mb-4">
      <h5 className="mb-3">Payroll Analytics</h5>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 p-3 text-center">
            <h6>Total Payroll This Month</h6>
            <h4 className="text-success mb-0">
              ₹
              {Number(kpis.total_payroll_this_month || 0).toLocaleString(
                "en-IN",
              )}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 p-3 text-center">
            <h6>Payslips Generated</h6>
            <h4 className="text-primary mb-0">
              {Number(kpis.payslips_generated || 0)}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 p-3 text-center">
            <h6>Payslips Pending</h6>
            <h4 className="text-warning mb-0">
              {Number(kpis.payslips_pending || 0)}
            </h4>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card p-3 h-100">
            <h6 className="mb-3">Total Payroll Disbursed per Month</h6>

            {monthlyData.length === 0 ? (
              <div className="text-center text-muted py-5">
                No monthly payroll data available
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="pay_month" />

                    <YAxis />

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />

                    <Bar
                      dataKey="total_payroll"
                      fill="#0d6efd"
                      name="Payroll"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3 h-100">
            <h6 className="mb-3">Department-wise Payroll Expenditure</h6>

            {departmentData.length === 0 ? (
              <div className="text-center text-muted py-5">
                No department payroll data available
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      dataKey="total_spend"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {departmentData.map((item, index) => (
                        <Cell
                          key={item.department}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollCharts;
