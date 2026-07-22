const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const reportRoutes = require("./routes/reportRoutes");
const assetRoutes = require("./routes/assetRoutes");
const helpDeskRoutes = require("./routes/helpDeskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Employee Management API is running");
});

app.use("/leaves", leaveRoutes);
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/performance", performanceRoutes);
app.use("/payroll", payrollRoutes);
app.use("/reports", reportRoutes);
app.use("/assets", assetRoutes);
app.use("/helpdesk", helpDeskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
