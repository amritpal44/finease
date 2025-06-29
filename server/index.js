const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const userExpenseRoutes = require("./routes/userExpenseRoutes");
const searchRoutes = require("./routes/searchRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const paymentMethodRoutes = require("./routes/paymentMethodRoutes");

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is started on port: ${PORT}`);
});

database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://finease-kappa.vercel.app"],
    credentials: true,
  })
);

app.use("/api/auth", userRoutes);
app.use("/api/expenses", userExpenseRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

//test
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "FinEase Server is up and running",
  });
});
