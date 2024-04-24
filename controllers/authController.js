const bcrypt = require('bcrypt');
const User = require('../models/user');

// Handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Invalid credentials
            return res.render('login', { error: 'Invalid username or password' });
        }

        // Store user data in session
        req.session.user = user;

        // Redirect to home page upon successful login
        res.redirect('/');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
};
