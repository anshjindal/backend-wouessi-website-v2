const mongoose = require('mongoose');
const department=require('./department');


const DesignationSchema = new mongoose.Schema({
    empId: {
        type: String,  
        required: true,
        index: true
    },
    title: {
        type: String,  
        required: true
    },
    departmentId: {
        type: String,
        ref: 'department', 
        required: true,
        
    },
    startDate: {
        type: Date,  
        required: true
    },
    endDate: {
        type: Date,  
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive"],  
        default: "active"
    }
});

module.exports = mongoose.model("Designation", DesignationSchema);
