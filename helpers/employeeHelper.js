const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Employee = require("../models/employee");
const Department = require("../models/department");

//generating unique employee id
const generateEmpId = async () => {
  // Get the latest employee
  const lastEmployee = await Employee.findOne().sort({ empId: -1 }).exec(); 

  if (lastEmployee && lastEmployee.empId) {
    const lastIdNumber = parseInt(
      lastEmployee.empId.replace("EMPLOYEE", ""),
      10
    );
    const nextIdNumber = lastIdNumber + 1;
    return `EMPLOYEE${nextIdNumber.toString().padStart(5, "0")}`;
  } else {
    return "EMPLOYEE00001"; // Default if no employees exist
  }
};

//generating department id
const generateDeptId = async () => {
  const lastDepartment = await Department.findOne()
    .sort({ departmentId: -1 })
    .exec();
  if (lastDepartment && lastDepartment.departmentId) {
    const lastIdNumber = parseInt(
      lastDepartment.departmentId.replace("DEPT", ""),
      10
    );
    const nextIdNumber = lastIdNumber + 1;
    return `DEPT${nextIdNumber.toString().padStart(3, "0")}`;
  } else {
    return "DEPT001";
  }
};

//generating  password
const generatePassword = (length = 12) => {
  if (length < 8) {
    throw new Error(
      "Password length must be at least 8 characters "
    );
  }
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

// encrypting the password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateEmpId,
  generateDeptId,
  generatePassword,
  hashPassword,
  comparePassword,
};
