const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Employee Management API is running");
});

app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
