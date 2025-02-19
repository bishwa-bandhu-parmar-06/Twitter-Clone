const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path =  require('path');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postRoutes = require('./routes/postRoutes');
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./database/config");
connectDB();

const app = express();
const Port = process.env.PORT || 4000;

const _dirname = path.resolve();

// CORS configuration
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }));
  

  app.use(cors({
    origin: true,
    credentials: true
}));
  // Remove COOP and COEP headers if they exist
  app.use((req, res, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    next();
  });

// ✅ Place `cookieParser` before `express.json`
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/api/users", userRoutes);
app.use('/api/posts', postRoutes);
// app.get("/", (req, res) => {
//     res.send("Hello World");
// });


app.use(express.static(path.join(_dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, 'client' , 'dist', 'index.html'));
});

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});
