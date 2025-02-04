const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const Port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
// Connect to MongoDB
const connectDB = require("./database/config");
connectDB();


// Enable CORS for frontend
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend to make requests
    credentials: true // Allow cookies if needed
  }));
  
const userRoutes = require("./routes/userRoutes");
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);



app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});