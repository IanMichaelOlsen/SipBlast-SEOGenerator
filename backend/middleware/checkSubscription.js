const Subscription = require('../models/Subscription'); // Import the Subscription model

// Middleware function to check if the user has an active subscription
async function checkSubscription(req, res, next) {
    try {
        // Find an active subscription for the user
        const subscription = await Subscription.findOne({ userId: req.user.userId, isActive: true });

        // If no active subscription is found, return a 403 status with an error message
        if (!subscription) {
            return res.status(403).json({ message: 'Active subscription required' });
        }

        // If an active subscription is found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If an error occurs during the database query, pass the error to the next middleware (error handler)
        next(error);
    }
}

module.exports = checkSubscription; // Export the checkSubscription function to be used in other parts of the application
