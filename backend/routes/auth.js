const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router object
const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing passwords
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating and verifying JWTs
const { body, validationResult } = require('express-validator'); // Import validation functions from express-validator
const User = require('../models/User'); // Import the User model

// Route to handle user registration
router.post('/register', [
    // Validate and sanitize the email and password fields
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim().escape()
], async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return 400 with validation errors if any
    }

    try {
        const { email, password } = req.body; // Extract email and password from the request body

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' }); // Return 400 if user exists
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user with the provided email and hashed password
        const user = new User({
            email,
            password: hashedPassword
        });
        // Save the user to the database
        await user.save();
        res.status(201).send('User registered successfully'); // Return 201 if user is created successfully
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle mongoose validation error
            return res.status(400).json({ message: error.message });
        } else {
            // Handle other errors
            next(error);
        }
    }
});

// Route to handle user login
router.post('/login', [
    // Validate and sanitize the email and password fields
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').not().isEmpty().withMessage('Password is required').trim().escape()
], async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return 400 with validation errors if any
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'User not found' }); // Return 400 if user is not found

        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: 'Invalid credentials' }); // Return 403 if passwords do not match
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);
        console.log('Generated Access Token:', accessToken);
        res.json({ accessToken, refreshToken }); // Return the tokens as JSON
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

// Route to handle token refresh
router.post('/token', [
    // Validate and sanitize the token field
    body('token').not().isEmpty().withMessage('Refresh token is required').trim().escape()
], async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return 400 with validation errors if any
    }

    const refreshToken = req.body.token; // Extract the refresh token from the request body
    if (!refreshToken) return res.sendStatus(401); // Return 401 if no refresh token is provided

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Return 403 if the token is invalid

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken }); // Return the new access token as JSON
    });
});

module.exports = router; // Export the router object to be used in other parts of the application
