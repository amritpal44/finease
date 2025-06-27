const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is started on port: ${PORT}`);
})

database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ 
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use("/api/auth", userRoutes);

//test
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "FinEase Server is up and running"
    });
});

