const bcrypt = require("bcryptjs");
const Employee = require("../models/employee");

const empAdd = async (employeeData) => {
  try {
    console.log("🔍 Step 1: Received Employee Data =>", employeeData);

    
    const existingEmployee = await Employee.findOne({ empId: employeeData.empId });
    if (existingEmployee) {
      throw new Error(`Employee with ID ${employeeData.empId} already exists`);
    }

   // Save new employee
    const newEmployee = new Employee(employeeData);
    await newEmployee.save();

    console.log("Step 2: Employee Added Successfully!");
    return { message: "Employee added successfully", empId: newEmployee.empId };
  } catch (error) {
    console.error("❌ Employee Add Error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { empAdd };
