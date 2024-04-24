// controllers/userController.js

const User = require('../models/user');
const Employee = require('../models/employee');

exports.addEmployee = async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).send('Only admins can add employees');
        }

        // Create a new employee based on the request body
        const newEmployee = await Employee.create(req.body);

        // Send a success response
        res.status(201).send('Employee added successfully');
    } catch (error) {
        // Handle any errors and send an error response
        console.error('Error adding employee:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).send('Only admins can delete employees');
        }

        // Find the employee by ID and delete it
        await Employee.findByIdAndDelete(req.params.id);

        // Send a success response
        res.status(200).send('Employee deleted successfully');
    } catch (error) {
        // Handle any errors and send an error response
        console.error('Error deleting employee:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewEmployees = async (req, res) => {
    try {
        // Fetch all employees from the database
        const employees = await Employee.find({});

        // Send the list of employees as a response
        res.status(200).json(employees);
    } catch (error) {
        // Handle any errors and send an error response
        console.error('Error fetching employees:', error);
        res.status(500).send('Internal Server Error');
    }
};
