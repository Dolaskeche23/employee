const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    location: String,
    phone: Number,
    title: String,
    address: String,
    age: Number,
    gender: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
