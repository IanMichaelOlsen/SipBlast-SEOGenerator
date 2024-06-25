require('dotenv').config(); // Load environment variables from a .env file into process.env
const express = require('express'); // Import the express module
const mongoose = require('mongoose'); // Import the mongoose module for MongoDB interaction
const dotenv = require('dotenv'); // Import the dotenv module to load environment variables
const morgan = require('morgan'); // Import the morgan module for HTTP request logging
const helmet = require('helmet'); // Import the helmet module for security by setting various HTTP headers
const cors = require('cors'); // Import the cors module to enable Cross-Origin Resource Sharing
const rateLimit = require('express-rate-limit'); // Import the express-rate-limit module for rate limiting
const errorHandler = require('./middleware/errorHandler'); // Import the custom error handler middleware
const authRoutes = require('./routes/auth'); // Import authentication routes
const sessionRoutes = require('./routes/sessions'); // Import session routes
const chatRoutes = require('./routes/chat'); // Import chat routes
const topicRoutes = require('./routes/topics'); // Import topic routes
const subscriptionRoutes = require('./routes/subscriptions'); // Import subscription routes

const app = express(); // Create an instance of an Express application
const PORT = process.env.PORT || 3001; // Set the port from environment variables or default to 3001

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected')) // Log success message on successful connection
    .catch(err => console.error('MongoDB connection error:', err)); // Log error message on connection error

// Configure rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes time window
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes' // Message sent when limit is exceeded
});

// Apply middlewares
app.use(helmet()); // Use helmet to secure Express apps by setting various HTTP headers
app.use(cors()); // Enable CORS for all routes
app.use(limiter); // Apply rate limiting to all requests
app.use(morgan('common')); // Use morgan for HTTP request logging in the 'common' format
app.use(express.json({ limit: '10kb' })); // Parse JSON request bodies with a size limit of 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded request bodies with a size limit of 10kb

// Define route handlers
app.use('/api/auth', authRoutes); // Use authentication routes for /api/auth path
app.use('/api/sessions', sessionRoutes); // Use session routes for /api/sessions path
app.use('/api/chat', chatRoutes); // Use chat routes for /api/chat path
app.use('/api/topics', topicRoutes); // Use topic routes for /api/topics path
app.use('/api/subscriptions', subscriptionRoutes); // Use subscription routes for /api/subscriptions path

app.use(errorHandler); // Use custom error handler middleware

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log message indicating server is running
});
