const mongoose = require("mongoose");
const Employee = require("../models/employee");
const Address = require("../models/address");
const {generateEmpId,generatePassword,hashPassword,} = require("../helpers/employeeHelper");

exports.createEmployee = async (employeeData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
    // Generating  Employee ID & Secure Password
    const empId = await generateEmpId();
    const tempPassword = generatePassword(12);
    const hashedPassword = await hashPassword(tempPassword.trim());

    console.log("Generated items", { empId, tempPassword, hashedPassword ,employeeData});

    // Create Employee Iiitially Without Addresses
    const newEmployee = new Employee({
      ...employeeData,
      empId,
      password: hashedPassword,
      addresses: [], 
    });

    const savedEmployee = await newEmployee.save({ session });

    //  Insert Addresses based one empid generated  & obtaining ids for reference
    if (employeeData.addresses && employeeData.addresses.length > 0) {
      const addresses = employeeData.addresses.map((address) => ({
        ...address,
        empId,
      }));

      const savedAddresses = await Address.insertMany(addresses, { session });

      // Update Employee with Address references
      savedEmployee.addresses = savedAddresses.map((addr) => addr._id);
      await savedEmployee.save({ session });
    }

    
    await session.commitTransaction();
    session.endSession();


    console.log("Employee & Addresses Created Successfully!");
    return {
      message: "Employee created successfully",
      empId,
      temporaryPassword: tempPassword, 
      
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(" Creation Failed:", error.message);
    throw new Error(error.message);
  }
};

// handles fetch employee details 
exports.getAllEmployees = async () => {
  try {
    const employees = await Employee.find().populate("addresses"); 
    return employees;
  } catch (error) {
    console.error("Error Fetching Employees:", error.message);
    throw new Error("Failed to fetch employees");
  }
};

exports.updateEmployee = async (empId, updatedData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingEmployee = await Employee.findOne({ empId }).populate("addresses");

    if (!existingEmployee) {
      throw new Error("Employee not found");
    }

    const updateFields = {};
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== undefined && updatedData[key] !== existingEmployee[key]) {
        updateFields[key] = updatedData[key];
      }
    });

    // Handle Address Updates Separately
    if (updatedData.addresses) {
      const updatedAddresses = updatedData.addresses;

      for (const address of updatedAddresses) {
        if (address._id) {
          // Update existing address
          await Address.findByIdAndUpdate(address._id, address, { session, new: true });
        } else {
          // Create a new address if not present
          const newAddress = await new Address({ ...address, empId }).save({ session });
          existingEmployee.addresses.push(newAddress._id);
        }
      }

      updateFields.addresses = existingEmployee.addresses;
    }

    // 4. Perform Update with `$set`
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId },
      { $set: updateFields },
      { new: true, session }
    ).populate("addresses");

    await session.commitTransaction();
    session.endSession();

    return updatedEmployee;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

