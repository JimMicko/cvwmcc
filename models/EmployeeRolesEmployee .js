// models/EmployeeRolesEmployee.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const EmployeeRole = require("./EmployeeRole");
const Employee = require("./Employee");

const EmployeeRolesEmployee = sequelize.define("EmployeeRolesEmployee", {
  employeeRoleId: {
    type: DataTypes.INTEGER,
    references: {
      model: EmployeeRole,
      key: "employeeRoleId",
    },
  },
  employeeId: {
    type: DataTypes.STRING,
    references: {
      model: Employee,
      key: "employeeId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
});

module.exports = EmployeeRolesEmployee;
