// Middleware function to handle errors
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack trace to the console for debugging

    // Send a JSON response with status 500 (Internal Server Error)
    res.status(500).json({
        success: false, // Indicate the success status of the response
        message: 'An unexpected error occurred. Please try again later.', // Provide a generic error message
        error: err.message // Optionally include the specific error message for additional context
    });
}

module.exports = errorHandler; // Export the errorHandler function to be used in other parts of the application
