const express = require("express");
const { addEmployee } = require("../controllers/employeeController");

const router = express.Router();

// Route to add a new employee
router.post("/add", addEmployee);

module.exports = router;
