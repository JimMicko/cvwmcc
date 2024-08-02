// routes/employeeRoutes.js

const express = require("express");
const multer = require('multer');
const upload = multer();
const router = express.Router();
const { calculateSafetyManHours, employeeLogin, searchEmployee, getUpdateEmployee, postUpdateEmployee, getAddEmployee, postAddEmployee, getEmployeeList, attendance, employeeLogin2, camera, submitViolation, getSubmitViolation, postSubmitViolation } = require("../controller/employeeController");
const uploadFields = [
    { name: 'picture', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
];

// Define routes and their corresponding controller functions
router.get("/employeeLogin2", employeeLogin2);
router.get("/employeeLogin", employeeLogin);
router.get("/addEmployee", getAddEmployee);
router.post("/addEmployee", upload.fields(uploadFields), postAddEmployee);
router.get("/searchEmployee", searchEmployee);
router.get("/updateEmployee", getUpdateEmployee);
router.post("/updateEmployee", upload.fields(uploadFields), postUpdateEmployee);
router.get("/employeeList", getEmployeeList);
// router.get("/generateQRCode/:employeeId", employeeController.generateQRCode);
router.get("/safetyManHours", calculateSafetyManHours);
router.get("/camera", camera);
router.get("/submitViolation/:employeeId?/:violationId?", getSubmitViolation);
router.post("/submitViolation/:employeeId/:violationId", postSubmitViolation);
router.get("/submitViolation", postSubmitViolation);

module.exports = router;