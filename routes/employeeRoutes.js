const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employeeController");
const verifySession = require("../middlewares/authenticationMiddleware"); 

// employee creation route
router.post("/empAdd", verifySession, EmployeeController.addEmployee);
router.get("/employees", verifySession,EmployeeController.getAllEmployees);
router.put("/:empId", verifySession,EmployeeController.updateEmployee);

module.exports = router;
