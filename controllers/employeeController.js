const EmployeeService = require("../service/employeeService");
const EmployeeRequest = require("../helpers/employeeRequest");

//this handles the Employee Creation Request
exports.addEmployee = async (req, res) => {
  try {
    // Validate inputs using DTO
    const errors = EmployeeRequest.validate(req.body);
    if (errors) return res.status(400).json({ error: errors });

  
    const response = await EmployeeService.createEmployee(req.body);

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Creating employee failed: " + error.message });
  }
};

//this handles the get employees request
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeService.getAllEmployees();

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }

    return res.status(200).json({
      message: "Employees retrieved successfully.",
      employees,
    });
  } catch (error) {
    console.error("Error Fetching Employees:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//handles employee update api 
exports.updateEmployee = async (req, res) => {
  try {
    const empId = req.params.empId; 
    const updatedData = req.body; 

    // Call Service to Handle Update Logic
    const result = await EmployeeService.updateEmployee(empId, updatedData);

    return res.status(200).json({
      message: "Employee updated successfully",
      updatedEmployee: result,
    });
  } catch (error) {
    console.error("Error Updating Employee:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
