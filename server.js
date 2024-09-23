const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');

// Create the Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Handle form submission (registration)
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).send('User already exists');
    }

    // Create a new user instance
    const newUser = new User({
        name,
        email,
        password,
    });

    try {
        // Save user to database
        await newUser.save();
        res.send('Registration successful!');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
