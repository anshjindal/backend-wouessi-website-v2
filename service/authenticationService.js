const bcrypt = require("bcryptjs");
const redisClient = require("../utils/redisConfig");
const Employee = require("../models/employee.js");
const { generateAccessToken, createRefreshToken } = require("../utils/jwtUtility"); 
const { v4: uuidv4 } = require("uuid");
const useragent = require("useragent");

const login = async (empId, password, req) => {
  console.log(empId, password);
  const employeeId = String(empId).trim();
  console.log(employeeId);

 
  const employee = await Employee.findOne({ empId: employeeId, status: "active" });

  console.log(employee);
  if (!employee) throw new Error("No employee exists with this Employee ID");

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) throw new Error("Invalid credentials! Please enter valid credentials");

  //Generating the JWT access token
  const accessToken = generateAccessToken(empId, employee.role);
  console.log(accessToken);

  // First time login using create refresh token for session refresh and all state management
  const { refreshToken, sessionId } = await createRefreshToken(empId); 

  const userAgent = useragent.parse(req.headers["user-agent"]);

  const sessionData = {
    token: refreshToken,
    ip: req.ip,
    browser: userAgent.family,
    os: userAgent.os.family,
    createdAt: new Date().toISOString()
  };

  try {
    await redisClient.hSet(`session:${empId}:${sessionId}`, sessionData);
    await redisClient.expire(`session:${empId}:${sessionId}`, 7 * 24 * 60 * 60);
  } catch (error) {
    console.error("Error storing session in Redis:", error);
    throw new Error("Internal server error during session management");
  }

  return { accessToken, refreshToken, sessionId, employee }; 
};

module.exports = { login };

