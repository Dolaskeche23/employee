// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAdmin = require('../middleware/isAdmin');

// Admin Routes
router.get('/admin/addEmployee', isAdmin, userController.addEmployee);
router.get('/admin/deleteEmployee/:id', isAdmin, userController.deleteEmployee);

// User Routes
router.get('/user/viewEmployees', userController.viewEmployees);

module.exports = router;
