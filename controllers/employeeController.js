const { empAdd } = require("../service/employeeService");

const addEmployee = async (req, res) => {
  try {    
    const employee = await empAdd(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addEmployee };
