const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB
const { v4: uuidv4 } = require('uuid'); // Import the uuid library to generate unique identifiers

// Define the schema for a subscription
const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Type is ObjectId, which references another document in the User collection
        ref: 'User', // Reference to the User model
        required: true // userId is required
    },
    plan: {
        type: String, // Type is String
        required: true, // plan is required
        enum: ['premium'] // Ensure only 'premium' is accepted
    },
    startDate: {
        type: Date, // Type is Date
        default: Date.now // Default value is the current date and time
    },
    endDate: {
        type: Date // Type is Date
        // No default value, as endDate will be set when the subscription ends
    },
    isActive: {
        type: Boolean, // Type is Boolean
        default: true // Default value is true, indicating the subscription is active
    },
    subscriptionId: {
        type: String, // Type is String
        default: () => uuidv4(), // Ensure a new UUID is generated for each subscription
        unique: true // Ensure the subscriptionId is unique
    }
}, { timestamps: true }); // Add timestamps to automatically manage createdAt and updatedAt fields

// Export the Subscription model based on the SubscriptionSchema
module.exports = mongoose.model('Subscription', SubscriptionSchema);
