// utils/associations.js

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee ");
const IdInformation = require("../models/IdInformation");
const User = require("../models/User");
const Violation = require("../models/Violation");
const ViolationList = require("../models/ViolationList");

// Define associations
IdInformation.hasMany(Attendance, {
  as: "attendances",
  foreignKey: "employee_id",
  sourceKey: "employee_id",
});
Attendance.belongsTo(IdInformation, {
  as: "IdInformation",
  foreignKey: "employee_id",
  targetKey: "employee_id",
});

Employee.hasMany(User, {
  as: "User",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
});
User.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
});

EmployeeRole.belongsToMany(Employee, {
  through: EmployeeRolesEmployee,
  foreignKey: "employeeRoleId",
  otherKey: "employeeId",
  as: "Employees",
});

Employee.belongsToMany(EmployeeRole, {
  through: EmployeeRolesEmployee,
  foreignKey: "employeeId",
  otherKey: "employeeRoleId",
  as: "EmployeeRoles",
});

Employee.hasMany(Violation, {
  as: "Violation",
  foreignKey: "employeeId",
  sourceKey: "employeeId",
});
Violation.belongsTo(Employee, {
  as: "Employee",
  foreignKey: "employeeId",
  targetKey: "employeeId",
});

ViolationList.hasMany(Violation, {
  as: "Violation",
  foreignKey: "violation_id",
  sourceKey: "violation_id",
});
Violation.belongsTo(ViolationList, {
  as: "ViolationList",
  foreignKey: "violation_id",
  targetKey: "violation_id",
});

// Export the associations
module.exports = {
  IdInformation,
  Attendance,
  Employee,
  User,
};
