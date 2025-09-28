require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");          
const sequelize = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.send("AQI Login/Register API is running");
});
app.use("/api/auth",authRoutes);
sequelize.authenticate()
.then(()=>{console.log("✅ MySQL connected via Sequelize");
    app.listen(PORT,()=>{console.log('server running on port',PORT);});
})
.catch(err=>console.error("❌ DB connection error:",err));
