const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const Employee = require('../models/employee'); // Assuming you have an employee model
const User = require('../models/user'); // Assuming you have a user model
const session = require('express-session');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = (app) => {

    // app.use(session({
    //     secret: '5161c06a053172c70f3d3a3e294b2484ef45c656cf0761da6440d51fe8265182  ', // You should replace this with a random secret key
    //     resave: false,
    //     saveUninitialized: true
    // }));

    app.get('/', async(req, res) => {
        const user = req.session.user;
        // console.log(user);
        if(!user) return res.redirect('/signup'); 
        const employees = await Employee.find({});

        res.render('index', { employees: employees });
        
    });
    // Route to render the login form
    app.get('/login', (req, res) => {
        res.render('login');
    });

    // Route to render the sign up form
    app.get('/signup', (req, res) => {
        res.render('signup');
    });

   
   // Route to handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
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
});


    // Route to handle user sign up
// Route to handle user sign up
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // Username already exists, handle accordingly
            return res.status(400).send('Username already exists. Please choose a different one.');
        }
        
        // Create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        res.redirect('/login'); // Render success page or redirect to another route
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (username/email already exists)
            return res.status(400).send('Username or email already exists. Please choose different ones.');
        }
        console.error('Error signing up:', error);
        res.status(500).send('Internal Server Error');
    }
});


    // Route to handle employee retrieval
    app.get('/employee/:id', async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.render('employee', { employee });
        } catch (err) {
            console.error('Error fetching employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });


    app.get('/favicon.ico', (req, res) => {
        res.status(204);
    });

    app.get('/', async (req, res) => {
        try {
            // Retrieve employee data from the database
            const employees = await Employee.find({});
            // Render the index page and pass the employee data to it
            res.render('index', { employees: employees });
        } catch (err) {
            console.error('Error retrieving employees:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    

    app.post('/', urlencodedParser, async (req, res) => {
        try {
            await Employee.create(req.body);
            res.redirect('/');
        } catch (err) {
            console.error('Error adding employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/:_id', async (req, res) => {
        try {
            const employee = await Employee.findById(req.params._id);
            res.render('employee', { employee: employee });
        } catch (err) {
            console.error('Error fetching employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.delete('/:_id', async (req, res) => {
        try {
            await Employee.findByIdAndDelete(req.params._id);
            res.json({ message: 'Employee deleted successfully' });
        } catch (err) {
            console.error('Error deleting employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/:_id', urlencodedParser, async (req, res) => {
        try {
            const id = req.params._id;
            await Employee.findByIdAndUpdate(id, req.body);
            res.redirect('back');
        } catch (err) {
            console.error('Error updating employee:', err);
            res.status(500).send('Internal Server Error');
        }
    });
};
