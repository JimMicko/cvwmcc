// routes/attendanceRoutes.js

const express = require("express");
const router = express.Router();
const { submitAttendance, submitAttendance2 } = require("../controller/attendanceController");

// Define routes and their corresponding controller functions
router.post("/submitAttendance/:employeeId", submitAttendance);
router.post("/submitAttendance2/:employeeId", submitAttendance2);

module.exports = router;