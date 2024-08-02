// controllers/employeeController.js

const qrcode = require("qrcode");
const Attendance = require("../models/Attendance");
const IdInformation = require("../models/IdInformation");
const Violation = require("../models/Violation");
const ViolationList = require("../models/ViolationList");

async function employeeLogin2(req, res) {
  try {
    // Fetch attendance and employee data using Sequelize
    const results = await Attendance.findAll({
      include: [
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: [
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
            "designation",
          ],
        },
      ],
    });

    // Filter employees based on the latest attendance status
    const filteredData = [];
    const employeeStatus = {};

    for (const row of results) {
      if (row.status === "TIME-IN") {
        // Store the latest TIME-IN event for each employee
        employeeStatus[row.employee_id] = row;
      } else if (row.status === "TIME-OUT" && employeeStatus[row.employee_id]) {
        // Remove the corresponding TIME-IN event for employees with TIME-OUT
        delete employeeStatus[row.employee_id];
      }
    }

    // Convert employeeStatus object back to an array
    for (const employeeId in employeeStatus) {
      filteredData.push(employeeStatus[employeeId]);
    }

    filteredData.sort((a, b) => {
      // Assuming your date and time columns are named 'date' and 'time', adjust the property names accordingly
      const dateTimeA = new Date(`${a.date}T${a.time}Z`);
      const dateTimeB = new Date(`${b.date}T${b.time}Z`);
      return dateTimeA - dateTimeB;
    });

    const data = {
      employeesWithoutTimeout: filteredData, // Pass the filtered data to the template
    };

    res.render("employeeLogin2", data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function employeeLogin(req, res) {
  try {
    // Fetch attendance and employee data using Sequelize
    const results = await Attendance.findAll({
      include: [
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: [
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
            "designation",
          ],
        },
      ],
    });

    // Filter employees based on the latest attendance status
    const filteredData = [];
    const employeeStatus = {};

    for (const row of results) {
      if (row.status === "TIME-IN") {
        // Store the latest TIME-IN event for each employee
        employeeStatus[row.employee_id] = row;
      } else if (row.status === "TIME-OUT" && employeeStatus[row.employee_id]) {
        // Remove the corresponding TIME-IN event for employees with TIME-OUT
        delete employeeStatus[row.employee_id];
      }
    }

    // Convert employeeStatus object back to an array
    for (const employeeId in employeeStatus) {
      filteredData.push(employeeStatus[employeeId]);
    }

    filteredData.sort((a, b) => {
      // Assuming your date and time columns are named 'date' and 'time', adjust the property names accordingly
      const dateTimeA = new Date(`${a.date}T${a.time}Z`);
      const dateTimeB = new Date(`${b.date}T${b.time}Z`);
      return dateTimeA - dateTimeB;
    });

    const data = {
      employeesWithoutTimeout: filteredData, // Pass the filtered data to the template
    };

    res.render("employeeLogin", data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function getAddEmployee(req, res) {
  try {
    res.render("addEmployee");
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).send("Error fetching employees from database");
  }
}

async function postAddEmployee(req, res) {
  try {
    console.log("Received data:", req.body);
    console.log("Received files:", req.files);

    const employeeData = {
      employee_id: req.body.employee_id,
      type_of_employee: req.body.type_of_employee,
      date_expire: req.body.date_expire || null,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      affix: req.body.affix,
      designation: req.body.designation,
      profile_picture: req.files["picture"][0].buffer, // Use req.file to access uploaded file
      birthday: req.body.birthday,
      contact_number: req.body.contact_number,
      address: req.body.address,
      address2: req.body.address2,
      sss_no: req.body.sss_no,
      pag_ibig_no: req.body.pag_ibig_no,
      philhealth_no: req.body.philhealth_no,
      tin_no: req.body.tin_no,
      signature: req.files["signature"][0].buffer, // Use req.file to access uploaded file
      contact_person: req.body.contact_person,
      contact_person_number: req.body.contact_person_number || null,
      contact_person_address: req.body.contact_person_address,
      contact_person_address2: req.body.contact_person_address2,
      url: `http://localhost:5000/submitAttendance/${req.body.employee_id}`,
    };

    // Insert the employee information into the database
    await IdInformation.create(employeeData);

    console.log("Employee inserted into the database");
    const employee_id = employeeData.employee_id;
    const id_name = `${employeeData.last_name}, ${employeeData.first_name} ${
      employeeData.affix
    } ${getFirstLetters(employeeData.middle_name)}.`;
    const id_name2 = `${employeeData.first_name} ${getFirstLetters(
      employeeData.middle_name
    )}. ${employeeData.last_name} ${employeeData.affix}`;
    const designation = employeeData.designation;
    const url = `http://localhost:5000/submitAttendance/${employee_id}`;
    const qrCodeURL = `http://localhost:5000/submitAttendance/${employee_id}`;

    qrcode.toDataURL(qrCodeURL, (err, qrCodeDataURL) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(500).send("Error generating QR code");
      }

      // Return the QR code image data as a response
      res.render("generateId", {
        qrCodeDataURL: qrCodeDataURL,
        successMessage: "Employee added successfully!",
        employee_id,
        id_name,
        id_name2,
        designation,
        url,
        type_of_employee: employeeData.type_of_employee,
        date_expire: convertDateFormat(employeeData.date_expire),
        profile_picture: employeeData.profile_picture,
        birthday: convertDateFormat(employeeData.birthday),
        contact_number: employeeData.contact_number,
        address: employeeData.address,
        address2: employeeData.address2,
        sss_no: employeeData.sss_no,
        pag_ibig_no: employeeData.pag_ibig_no,
        philhealth_no: employeeData.philhealth_no,
        tin_no: employeeData.tin_no,
        signature: employeeData.signature,
        contact_person: employeeData.contact_person,
        contact_person_number: employeeData.contact_person_number,
        contact_person_address: employeeData.contact_person_address,
        contact_person_address2: employeeData.contact_person_address2,
      });
    });
  } catch (error) {
    console.error("Error inserting employee:", error);
    res.status(500).send(`Error inserting employee into database: ${error}`);
  }
}

async function searchEmployee(req, res) {
  try {
    res.render("searchEmployee");
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function getUpdateEmployee(req, res) {
  const employeeId = req.query.employee_id; // Get the employee_id from the query string

  if (!employeeId) {
    return res.status(400).send("Employee ID is required");
  }

  try {
    // Perform a database query to fetch employee data by ID
    const employeeData = await IdInformation.findOne({
      where: { employee_id: employeeId },
    });

    if (!employeeData) {
      return res.status(404).send("Employee not found");
    }

    // Extract the birthday date and format it
    const birthday = new Date(employeeData.birthday); // Assuming "birthday" is the field in your database
    const date_expire = new Date(employeeData.date_expire); // Assuming "date_expire" is the field in your database
    console.log(birthday);
    // Add 1 day to the birthday
    birthday.setDate(birthday.getDate());
    date_expire.setDate(date_expire.getDate());
    console.log(birthday);
    // Format the modified date as an ISO date string (YYYY-MM-DD)
    const formattedBirthday = birthday.toISOString().split("T")[0];
    const formatted_date_expire = date_expire.toISOString().split("T")[0];

    // Pass the formatted date and employee data to the template for rendering in the input fields
    res.render("updateEmployee", {
      employeeData: employeeData.toJSON(),
      formattedBirthday,
      formatted_date_expire,
    });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).send("Error fetching employee data from database");
  }
}

async function postUpdateEmployee(req, res) {
  console.log("Received data:", req.body);
  console.log("Received files:", req.files);

  const employee = {
    employee_id: req.body.employee_id,
    type_of_employee: req.body.type_of_employee,
    date_expire: req.body.date_expire || null,
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    affix: req.body.affix,
    designation: req.body.designation,
    profile_picture: req.files["picture"]
      ? req.files["picture"][0].buffer
      : null,
    birthday: req.body.birthday,
    contact_number: req.body.contact_number,
    address: req.body.address,
    address2: req.body.address2,
    sss_no: req.body.sss_no,
    pag_ibig_no: req.body.pag_ibig_no,
    philhealth_no: req.body.philhealth_no,
    tin_no: req.body.tin_no,
    signature: req.files["signature"] ? req.files["signature"][0].buffer : null,
    contact_person: req.body.contact_person,
    contact_person_number: req.body.contact_person_number || null,
    contact_person_address: req.body.contact_person_address,
    contact_person_address2: req.body.contact_person_address2,
  };

  try {
    const existingEmployee = await IdInformation.findOne({
      where: { employee_id: employee.employee_id },
    });

    if (existingEmployee) {
      // Employee with the same ID exists, perform an update
      await IdInformation.update(employee, {
        where: { employee_id: employee.employee_id },
      });
      console.log("Employee updated in the database");

      const employee_id = employee.employee_id;
      const id_name = `${employee.last_name}, ${employee.first_name} ${
        employee.affix
      } ${getFirstLetters(employee.middle_name)}.`;
      const id_name2 = `${employee.first_name} ${getFirstLetters(
        employee.middle_name
      )}. ${employee.last_name} ${employee.affix}`;
      const designation = employee.designation;
      const url = `http://localhost:5000/submitAttendance/${employee.employee_id}`;
      const qrCodeURL = `http://localhost:5000/submitAttendance/${employee_id}`;

      qrcode.toDataURL(qrCodeURL, (err, qrCodeDataURL) => {
        if (err) {
          console.error("Error generating QR code:", err);
          return res.status(500).send("Error generating QR code");
        }
        // Return the QR code image data as a response
        res.render("generateID", {
          qrCodeDataURL: qrCodeDataURL,
          successMessage: "Employee updated successfully!",
          employee_id,
          id_name,
          id_name2,
          designation,
          url,
          type_of_employee: employee.type_of_employee,
          date_expire: convertDateFormat(employee.date_expire),
          profile_picture: employee.profile_picture,
          birthday: convertDateFormat(employee.birthday),
          contact_number: employee.contact_number,
          address: employee.address,
          address2: employee.address2,
          sss_no: employee.sss_no,
          pag_ibig_no: employee.pag_ibig_no,
          philhealth_no: employee.philhealth_no,
          tin_no: employee.tin_no,
          signature: employee.signature,
          contact_person: employee.contact_person,
          contact_person_number: employee.contact_person_number,
          contact_person_address: employee.contact_person_address,
          contact_person_address2: employee.contact_person_address2,
        });
      });
    } else {
      return res.status(404).send("Employee not found");
    }
  } catch (error) {
    console.error("Error checking if employee exists:", error);
    res
      .status(500)
      .send(`Error checking if employee exists in database: ${error}`);
  }
}

async function getEmployeeList(req, res) {
  try {
    // Fetch attendance and employee data using Sequelize
    const results = await IdInformation.findAll({
      order: [["employee_id", "ASC"]],
    });

    res.render("employeeList", { results });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

// app.get("/generateQRCode/:employeeId", (req, res) => {
//   const employeeId = req.params.employeeId;
//   const qrCodeURL = `http://localhost:5000/submitAttendance/${employeeId}`;

//   qrcode.toDataURL(qrCodeURL, (err, qrCodeDataURL) => {
//     if (err) {
//       console.error("Error generating QR code:", err);
//       return res.status(500).send("Error generating QR code");
//     }

//     // Return the QR code image data as a response
//     res.render("generateId", { qrCodeDataURL: qrCodeDataURL });
//   });
// });

// app.post("/submitAttendance/:employeeId", async (req, res) => {
//   const employeeId = req.params.employeeId;
//   const timestamp = new Date().toISOString().split("T")[0];
//   const now = new Date();
//   const hours = now.getHours().toString().padStart(2, "0");
//   const minutes = now.getMinutes().toString().padStart(2, "0");
//   const seconds = now.getSeconds().toString().padStart(2, "0");
//   const currentTime = `${hours}:${minutes}:${seconds}`;

//   try {
//     // Check the previous attendance status of the employee
//     const previousAttendance = await new Promise((resolve, reject) => {
//       pool.query(
//         "SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC, time DESC LIMIT 1",
//         [employeeId],
//         (error, results) => {
//           if (error) {
//             console.error("Error fetching previous attendance:", error);
//             reject("Error fetching previous attendance");
//           }
//           resolve(results);
//         }
//       );
//     });

//     console.log("Previous attendance status results:", previousAttendance);

//     let status = "TIME-IN"; // Default status

//     if (previousAttendance.length > 0) {
//       // If the last status was TIME-IN, set to TIME-OUT, else set to TIME-IN
//       status =
//         previousAttendance[0].status === "TIME-IN" ? "TIME-OUT" : "TIME-IN";
//     }

//     const attendance = {
//       employee_id: employeeId,
//       date: timestamp,
//       time: currentTime,
//       status: status, // Set status based on previous attendance
//     };

//     // Insert the attendance information into the attendance table
//     await new Promise((resolve, reject) => {
//       pool.query(
//         "INSERT INTO attendance (employee_id, date, time, status) VALUES (?, ?, ?, ?)",
//         [
//           attendance.employee_id,
//           attendance.date,
//           attendance.time,
//           attendance.status,
//         ],
//         (error, results) => {
//           if (error) {
//             console.error("Error submitting attendance:", error);
//             reject("Error submitting attendance");
//           }
//           resolve();
//         }
//       );
//     });

//     // Retrieve employee data
//     const employeeData = await new Promise((resolve, reject) => {
//       pool.query(
//         "SELECT * FROM employees WHERE employee_id = ?",
//         [attendance.employee_id],
//         (error, results) => {
//           if (error) {
//             console.error("Error fetching employee:", error);
//             reject("Error fetching employee");
//           }

//           const employeeDataSet = results[0]; // Assuming there's only one matching row

//           // Assuming you have the profile picture Buffer in the `employeeDataSet` object
//           const profilePictureBuffer = employeeDataSet.profile_picture;

//           // Convert the Buffer to a Base64 data URL
//           const profilePictureBase64 = profilePictureBuffer.toString("base64");

//           // Add the Base64 data URL to the employeeDataSet object
//           employeeDataSet.profile_picture_base64 = `data:image/png;base64,${profilePictureBase64}`;

//           resolve(employeeDataSet);
//         }
//       );
//     });

//     // Render the view with attendance, employee data, and updated safety man-hours
//     res.render("attendance", {
//       attendance: attendance,
//       employeeData: employeeData,
//     });
//   } catch (error) {
//     // Handle errors and send an error response
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Route to calculate safety man-hours
async function calculateSafetyManHours(req, res) {
  try {
    // Fetch all attendance records using Sequelize
    const attendanceLogs = await Attendance.findAll();
    const result = calculateSafetyManHours2(attendanceLogs);

    // Send the result as JSON
    res.json(result);
  } catch (error) {
    console.error("Error fetching attendance logs:", error);
    res.status(500).json({ error: "Error fetching attendance logs" });
  }
}

async function camera(req, res) {
  try {
    res.render("camera");
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function getSubmitViolation(req, res) {
  try {
    let employeeData = null;
    let violation = null;
    let allViolationListsPlain = null;

    if (req.params.employeeId !== undefined && req.params.employeeId !== null) {
      const employeeId = req.params.employeeId;

      employeeData = await IdInformation.findOne({
        where: { employee_id: employeeId },
      });
      violation = await Violation.findAll({
        where: { employee_id: employeeId },
        include: [{ model: ViolationList, as: "ViolationList" }],
      });

      if (!employeeData) {
        return res.status(404).send("Employee not found");
      }

      employeeData = employeeData.toJSON();
      if (violation) {
        violation = violation.map((v) => v.toJSON());
      }
    }

    allViolationListsPlain = await ViolationList.findAll();
    allViolationListsPlain = allViolationListsPlain.map((v) => v.toJSON());

    res.render("submitViolation", {
      employeeData,
      violation,
      allViolationListsPlain,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function postSubmitViolation(req, res) {
  try {
    const employeeId = req.params.employeeId;
    const violationId = req.params.violationId;

    // Assuming you have a model for storing violation submissions
    await Violation.create({
      employee_id: employeeId,
      violation_id: violationId,
      // Include any other relevant data you want to store
    });

    // Handle success response
    res.status(200).send("Violation submitted successfully.");
  } catch (error) {
    console.error("Error submitting violation:", error);
    res.status(500).send("Error submitting violation: " + error.message); // Include error message for debugging
  }
}

function convertDateFormat(inputDate) {
  try {
    // Split the input date into year, month, and day components
    const [year, month, day] = inputDate.split("-");

    // Create a new Date object using the parsed components
    const date = new Date(year, month - 1, day); // Note: Month is 0-based

    // Create an array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Format the date into the desired output format
    const formattedDate = `${monthNames[date.getMonth()]} ${day}, ${year}`;

    return formattedDate;
  } catch (error) {
    return "Invalid date format. Please use the format 'YYYY-MM-DD'.";
  }
}

function calculateSafetyManHours2(records) {
  var overAllManHours = 0;
  const safetyManHoursByEmployee = {};

  // Step 1: Iterate through unique employee IDs
  const uniqueEmployeeIds = [
    ...new Set(records.map((record) => record.employee_id)),
  ];

  // Initialize safetyManHoursByEmployee with 0.0 for each employee
  uniqueEmployeeIds.forEach((employeeId) => {
    safetyManHoursByEmployee[employeeId] = 0.0;
  });

  for (const employeeId of uniqueEmployeeIds) {
    let totalTimeIn = null;
    let totalSafetyManHours = safetyManHoursByEmployee[employeeId]; // Initialize with the previous total

    for (const record of records) {
      if (record.employee_id === employeeId) {
        if (record.status === "TIME-IN") {
          var date = new Date(record.date);
          const year = date.getFullYear(); // Get the year (e.g., 2023)
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-11) and add 1 (e.g., 09 for September)
          const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month (e.g., 08)
          const formattedDate = `${year}-${month}-${day}`;
          totalTimeIn = new Date(formattedDate + "T" + record.time);
        } else if (record.status === "TIME-OUT" && totalTimeIn !== null) {
          var date2 = new Date(record.date);
          const year2 = date2.getFullYear(); // Get the year (e.g., 2023)
          const month2 = String(date2.getMonth() + 1).padStart(2, "0"); // Get the month (0-11) and add 1 (e.g., 09 for September)
          const day2 = String(date2.getDate()).padStart(2, "0"); // Get the day of the month (e.g., 08)
          const formattedDate2 = `${year2}-${month2}-${day2}`;
          const timeOut = new Date(formattedDate2 + "T" + record.time);
          const workedMilliseconds = timeOut - totalTimeIn;
          const workedHours = workedMilliseconds / 1000; // / (1000 * 60 * 60); Convert milliseconds to hours
          totalSafetyManHours += workedHours;
          totalTimeIn = null; // Reset for the next pairing
        }
      }
    }
    // console.log(totalTimeIn)
    // Step 3: If there's a TIME-IN without a TIME-OUT, calculate safety man-hours to current time
    if (totalTimeIn !== null) {
      const currentTime = new Date();
      const workedMilliseconds = currentTime - totalTimeIn;
      const workedHours = workedMilliseconds / 1000; // Convert milliseconds to hours
      totalSafetyManHours += workedHours;
    }

    // Step 2: Store the total safety man-hours for the employee
    safetyManHoursByEmployee[employeeId] = totalSafetyManHours;
    overAllManHours += totalSafetyManHours;
  }
  // console.log(overAllManHours.toFixed(2))
  return overAllManHours.toFixed(2);
}

function getFirstLetters(str) {
  // Split the string into words using whitespace as the delimiter
  const words = str.split(" ");

  // Initialize an array to store the first letters
  const firstLetters = [];

  // Iterate through the words and extract the first letter of each
  for (const word of words) {
    if (word.length > 0) {
      // Check if the word is not empty
      const firstLetter = word[0]; // Get the first letter
      firstLetters.push(firstLetter); // Add it to the array
    }
  }

  // Join the first letters into a string and return it
  return firstLetters.join("");
}

module.exports = {
  calculateSafetyManHours,
  employeeLogin2,
  employeeLogin,
  getAddEmployee,
  postAddEmployee,
  searchEmployee,
  getUpdateEmployee,
  postUpdateEmployee,
  getEmployeeList,
  camera,
  getSubmitViolation,
  postSubmitViolation,
};
