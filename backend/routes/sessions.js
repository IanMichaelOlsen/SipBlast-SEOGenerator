const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router object
const authenticateToken = require('../middleware/authenticateToken'); // Import the authenticateToken middleware
const Session = require('../models/Session'); // Import the Session model

// Route to start a new session
router.post('/start', authenticateToken, async (req, res, next) => {
    try {
        // Create a new session with the userId from the authenticated user
        const session = new Session({ userId: req.user.userId });
        // Save the session to the database
        await session.save();
        // Respond with the session ID
        res.status(201).json({ sessionId: session._id });
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

// Route to end an existing session
router.post('/end', authenticateToken, async (req, res, next) => {
    const { sessionId } = req.body; // Extract sessionId from the request body

    try {
        // Find the session by its ID
        const session = await Session.findById(sessionId);
        // Check if the session exists and if it belongs to the authenticated user
        if (!session || session.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' }); // Return 403 if unauthorized
        }

        // Set the endTime to the current date and time
        session.endTime = new Date();
        // Calculate the duration of the session in seconds
        session.duration = (session.endTime - session.startTime) / 1000; // Duration in seconds
        // Save the updated session to the database
        await session.save();
        // Respond with the updated session
        res.json(session);
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

module.exports = router; // Export the router object to be used in other parts of the application
