// app.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const qrcode = require("qrcode");

// Import utility functions and models
require("./utils/associations");

const app = express();

// Set up storage for multer
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });
// Configure the fields you want to accept and the maximum number of files for each field
const uploadFields = [
  { name: "picture", maxCount: 1 },
  { name: "signature", maxCount: 1 },
];

app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  express.static(path.join(__dirname, "public"), {
    type: "application/javascript",
  })
);

// Serve Bootstrap files from the 'node_modules' folder
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// Set Cache-Control header to prevent caching
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});

app.use(express.urlencoded({ extended: true })); // Middleware to parse POST data

// Use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Use only with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 10000, // Session expiration time
    },
  })
);

// Middleware to check authentication
const { isAuthenticated } = require("./middlewares/auth");
app.use("/home", isAuthenticated);
app.use("/searchEmployee", isAuthenticated);
app.use("/updateEmployee", isAuthenticated);
app.use("/employeeLogin", isAuthenticated);

// Include your routes
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use(authRoutes);
app.use(homeRoutes);
app.use(employeeRoutes);
app.use(attendanceRoutes);

// Function to initialize the application
async function initializeApp() {
  try {
    console.log("Syncing models to the database...");
    await sequelize.sync({ alter: false });
    console.log("Models synced successfully.");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
}

const sequelize = require("./config/database");

// Call the function to initialize the application
initializeApp();

module.exports = app;
