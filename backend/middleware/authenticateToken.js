const jwt = require('jsonwebtoken'); // Import the jsonwebtoken module to handle JWT operations

// Middleware function to authenticate the token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Get the authorization header from the request

    // Ensure authHeader is in the expected format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' }); // Return 401 if header is missing or malformed
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the header

    // Check if the token is null
    if (!token) {
        return res.status(401).json({ message: 'Token missing' }); // Return 401 if the token is missing
    }

    // Ensure the ACCESS_TOKEN_SECRET is defined
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error('ACCESS_TOKEN_SECRET environment variable is not set'); // Log an error if the secret is not set
        return res.status(500).json({ message: 'Internal server error' }); // Return 500 if the secret is not set
    }

    // Verify the token using the secret
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err); // Log the error if token verification fails
            return res.status(403).json({ message: 'Invalid token' }); // Return 403 if the token is invalid
        }
        req.user = user; // Attach the decoded user information to the request object
        next(); // Call the next middleware function
    });
}

module.exports = authenticateToken; // Export the authenticateToken function to be used in other parts of the application
