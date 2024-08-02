// controllers/authController.js

const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee ");
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function getLoginController(req, res) {
  try {
    const viewsData = {
      pageTitle: "Login",
    };
    res.render("login", viewsData); // Assuming you have a login.ejs file in your views folder
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Example controller function for handling login
async function postLoginController(req, res) {
  const { employeeId, password } = req.body;
  try {
    // Find the user with the provided employee ID
    const user = await User.findOne({
      where: { employeeId },
    });
    console.log(employeeId);
    // Check if the user exists
    if (!user) {
      const viewsData = {
        pageTitle: "Login",
        error: "Invalid employee ID or password",
      };
      return res.render("login", viewsData);
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const viewsData = {
        pageTitle: "Login",
        error: "Invalid employee ID or password",
      };
      return res.render("login", viewsData);
    }

    // Find the user's role(s) from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    // Assuming a user can have multiple roles, handle each role accordingly
    let redirected = false;
    for (const role of employeeRoles) {
      if (role.employeeRoleId === 9) {
        req.session.employeeId = user.employeeId;
        res.redirect(`/home`);
        redirected = true;
        break;
      } else if (role.employeeRoleId === 11) {
        req.session.employeeId = user.employeeId;
        res.redirect(`/home`);
        redirected = true;
        break;
      }
    }
    console.log(redirected);
    // If no role matched, redirect to a default route
    if (!redirected) {
      res.redirect(`/`);
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors gracefully, redirect to an error page, or display a generic error message
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { postLoginController, getLoginController };
