require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");          
const sequelize = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("AQI Login/Register API is running");
});
app.use("/api/auth", authRoutes);

// DB connection and server start
sequelize.authenticate()
.then(() => {
    console.log("✅ MySQL connected via Sequelize");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
})
.catch(err => console.error("❌ DB connection error:", err));
