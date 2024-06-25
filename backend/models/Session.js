const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB

// Define the schema for a session
const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Type is ObjectId, which references another document in the User collection
        ref: 'User', // Reference to the User model
        required: true // userId is required
    },
    startTime: {
        type: Date, // Type is Date
        default: Date.now // Default value is the current date and time
    },
    endTime: {
        type: Date // Type is Date
        // No default value, as endTime will be set when the session ends
    },
    duration: {
        type: Number, // Type is Number
        default: 0 // Default value is 0, duration is in seconds
    }
});

// Export the Session model based on the SessionSchema
module.exports = mongoose.model('Session', SessionSchema);
