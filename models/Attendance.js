// models/Attendance.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("TIME-IN", "TIME-OUT"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Attendance;
