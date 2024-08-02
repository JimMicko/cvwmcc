// models/employee.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path accordingly

const Employee = sequelize.define(
  "Employee",
  {
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.STRING,
    },
    affix: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    birthPlace: {
      type: DataTypes.STRING,
    },
    mobileNo: {
      type: DataTypes.STRING,
    },
    emailAddress: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permanentAddress: {
      type: DataTypes.STRING,
    },
    otherAddress: {
      type: DataTypes.STRING,
    },
    motherMaidenName: {
      type: DataTypes.STRING,
    },
    educationalAttainment: {
      type: DataTypes.STRING,
    },
    course: {
      type: DataTypes.STRING,
    },
    yearGraduate: {
      type: DataTypes.STRING,
    },
    tinNo: {
      type: DataTypes.STRING,
    },
    sssGsisNo: {
      type: DataTypes.STRING,
    },
    philhealthNo: {
      type: DataTypes.STRING,
    },
    pagIbigNo: {
      type: DataTypes.STRING,
    },
    driversLicenseNo: {
      type: DataTypes.STRING,
    },
    nbiNo: {
      type: DataTypes.STRING,
    },
    policeClearanceNo: {
      type: DataTypes.STRING,
    },
    cedulaNo: {
      type: DataTypes.STRING,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
    },
    employeeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dailyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dayAllowance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nightAllowance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timeIn: {
      type: DataTypes.STRING,
    },
    timeOut: {
      type: DataTypes.STRING,
    },
    dateOfResignation: {
      type: DataTypes.DATEONLY,
    },
    reasonOfResignation: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true, // Adjust the allowNull based on your requirements
    },
    submittedBy: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Employee;
