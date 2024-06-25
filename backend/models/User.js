const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB
const { v4: uuidv4 } = require('uuid'); // Import the uuid library to generate unique identifiers

// Define the schema for a user
const UserSchema = new mongoose.Schema({
    email: {
        type: String, // Type is String
        required: true, // email is required
        unique: true, // Ensure the email is unique
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email validation regex pattern with a custom error message
    },
    password: {
        type: String, // Type is String
        required: true // password is required
    },
    subscriptionId: {
        type: String, // Type is String
        default: () => uuidv4() // Ensure a new UUID is generated for each user by default
    },
    activeTime: {
        type: Number, // Type is Number
        default: 0 // Default value is 0, indicating no active time initially
    },
}, { timestamps: true }); // Add timestamps to automatically manage createdAt and updatedAt fields

// Export the User model based on the UserSchema
module.exports = mongoose.model('User', UserSchema);
