require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const controller = require('./controllers/controller');
const authController = require('./controllers/authController');
const crypto = require('crypto');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const secretKey = crypto.randomBytes(32).toString('hex');


// Session middleware
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));
console.log(secretKey);

app.post('/login', authController.login); 

// Set view engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static('./public'));

// Routes
controller(app); // Pass the 'app' object to the controller

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
