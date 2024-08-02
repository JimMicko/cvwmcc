// controllers/attendanceController.js

const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

const Attendance = require("../models/Attendance");
const IdInformation = require("../models/IdInformation");
const Violation = require("../models/Violation");
const ViolationList = require("../models/ViolationList");

async function submitAttendance(req, res) {
  const employeeId = req.params.employeeId;
  const now = moment().tz("Asia/Singapore"); // Set the current time to UTC+8

  const timestamp = now.format("YYYY-MM-DD");
  const currentTime = now.format("HH:mm:ss");

  try {
    // Check the previous attendance status of the employee
    const previousAttendance = await Attendance.findOne({
      where: { employee_id: employeeId },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
      limit: 1,
    });

    console.log("Previous attendance status results:", previousAttendance);

    let status = "TIME-IN"; // Default status
    let audioIrl = "/public/time-in.mp3";

    if (previousAttendance && previousAttendance.status === "TIME-IN") {
      // If the last status was TIME-IN, set to TIME-OUT, else set to TIME-IN
      status = "TIME-OUT";
      audioIrl = "/public/time-out.mp3";
    }

    // Insert the attendance information into the attendance table
    await Attendance.create({
      employee_id: employeeId,
      date: timestamp,
      time: currentTime,
      status: status,
    });

    // Retrieve employee data
    const employeeData = await IdInformation.findOne({
      where: { employee_id: employeeId },
    });

    // Retrieve violation data for the employee if it exists
    const violations = await Violation.findAll({
      where: { employee_id: employeeId },
      include: [
        {
          model: ViolationList,
          as: "ViolationList", // Specify the alias used in the association
        },
      ],
    });

    console.log(`List of Violations: ${JSON.stringify(violations, null, 2)}`); // Log the violations as JSON

    // Assuming you have the profile picture Buffer in the `employeeData` object
    const profilePictureBuffer = employeeData.profile_picture;

    // Convert the Buffer to a Base64 data URL
    const profilePictureBase64 = profilePictureBuffer.toString("base64");

    // Add the Base64 data URL to the employeeData object
    employeeData.profile_picture_base64 = `data:image/png;base64,${profilePictureBase64}`;

    // Render the view with attendance, employee data, violations, and updated safety man-hours
    res.render("attendance", {
      attendance: {
        employee_id: employeeId,
        date: timestamp,
        time: currentTime,
        status: status,
      },
      employeeData: employeeData,
      violations: violations.map((v) => v.toJSON()), // Pass violations as plain objects to the view
      audioUrl: audioIrl,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function submitAttendance2(req, res) {
  const employeeId = req.params.employeeId;
  const now = moment().tz("Asia/Singapore"); // Set the current time to UTC+8

  const timestamp = now.format("YYYY-MM-DD");
  const currentTime = now.format("HH:mm:ss");

  try {
    // Check the previous attendance status of the employee
    const previousAttendance = await Attendance.findOne({
      where: { employee_id: employeeId },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
      limit: 1,
    });

    console.log("Previous attendance status results:", previousAttendance);

    let status = "TIME-IN"; // Default status
    let audioIrl = "/public/time-in.mp3";

    if (previousAttendance && previousAttendance.status === "TIME-IN") {
      // If the last status was TIME-IN, set to TIME-OUT, else set to TIME-IN
      status = "TIME-OUT";
      audioIrl = "/public/time-out.mp3";
    }

    // Insert the attendance information into the attendance table
    await Attendance.create({
      employee_id: employeeId,
      date: timestamp,
      time: currentTime,
      status: status,
    });

    // Retrieve employee data
    const employeeData = await IdInformation.findOne({
      where: { employee_id: employeeId },
    });

    // Retrieve violation data for the employee if it exists
    const violations = await Violation.findAll({
      where: { employee_id: employeeId },
      include: [
        {
          model: ViolationList,
          as: "ViolationList", // Specify the alias used in the association
        },
      ],
    });

    console.log(`List of Violations: ${JSON.stringify(violations, null, 2)}`); // Log the violations as JSON

    // Assuming you have the profile picture Buffer in the `employeeData` object
    const profilePictureBuffer = employeeData.profile_picture;

    // Convert the Buffer to a Base64 data URL
    const profilePictureBase64 = profilePictureBuffer.toString("base64");

    // Add the Base64 data URL to the employeeData object
    employeeData.profile_picture_base64 = `data:image/png;base64,${profilePictureBase64}`;

    // Render the view with attendance, employee data, violations, and updated safety man-hours
    res.render("attendance2", {
      attendance: {
        employee_id: employeeId,
        date: timestamp,
        time: currentTime,
        status: status,
      },
      employeeData: employeeData,
      violations: violations.map((v) => v.toJSON()), // Pass violations as plain objects to the view
      audioUrl: audioIrl,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { submitAttendance, submitAttendance2 };
