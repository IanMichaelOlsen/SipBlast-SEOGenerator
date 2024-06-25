const rateLimit = require('express-rate-limit'); // Import the express-rate-limit module to limit repeated requests
const cors = require('cors'); // Import the cors module to enable Cross-Origin Resource Sharing
const helmet = require('helmet'); // Import the helmet module to secure Express apps by setting various HTTP headers

// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes time window
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes' // Message sent when rate limit is exceeded
});

// Configure CORS options
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin (update to match your frontend URL)
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204, so we use 200
};

module.exports = {
    helmet: helmet(), // Export helmet middleware to set secure HTTP headers
    cors: cors(corsOptions), // Export CORS middleware with the specified options
    limiter: limiter // Export rate limiting middleware
};
