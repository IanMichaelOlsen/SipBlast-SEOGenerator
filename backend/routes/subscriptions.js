const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router object
const { body, validationResult } = require('express-validator'); // Import validation functions from express-validator
const authenticateToken = require('../middleware/authenticateToken'); // Import the authenticateToken middleware
const User = require('../models/User'); // Import the User model
const Subscription = require('../models/Subscription'); // Import the Subscription model

// Route to subscribe a user to a plan
router.post('/subscribe', authenticateToken, [
    // Validate and sanitize the userId and plan fields
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('plan').not().isEmpty().withMessage('Plan is required').trim().escape()
], async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return 400 with validation errors if any
    }

    try {
        const { userId, plan } = req.body; // Extract userId and plan from the request body

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Return 404 if user is not found
        }

        // Deactivate any existing active subscriptions for the user
        await Subscription.updateMany({ userId, isActive: true }, { isActive: false });

        // Create a new subscription
        const subscription = new Subscription({
            userId,
            plan
        });
        // Save the new subscription to the database
        await subscription.save();

        // Respond with the subscription ID
        res.status(201).json({ subscriptionId: subscription.subscriptionId });
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

// Route to check the status of the user's active subscription
router.get('/status', authenticateToken, async (req, res, next) => {
    try {
        // Find the active subscription for the authenticated user
        const subscription = await Subscription.findOne({ userId: req.user.userId, isActive: true });
        if (!subscription) return res.status(404).send('No active subscription found'); // Return 404 if no active subscription is found

        res.json(subscription); // Respond with the active subscription
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

// Route to get all subscriptions of the authenticated user
router.get('/all', authenticateToken, async (req, res, next) => {
    try {
        // Find all subscriptions for the authenticated user
        const subscriptions = await Subscription.find({ userId: req.user.userId });
        res.json(subscriptions); // Respond with all subscriptions
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

// Route to cancel the user's active subscription
router.put('/cancel', authenticateToken, async (req, res, next) => {
    try {
        // Find the active subscription and set it to inactive with the current date as the end date
        const subscription = await Subscription.findOneAndUpdate(
            { userId: req.user.userId, isActive: true },
            { isActive: false, endDate: new Date() },
            { new: true } // Return the updated document
        );
        if (!subscription) return res.status(404).send('No active subscription found'); // Return 404 if no active subscription is found

        res.json(subscription); // Respond with the updated subscription
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

module.exports = router; // Export the router object to be used in other parts of the application
