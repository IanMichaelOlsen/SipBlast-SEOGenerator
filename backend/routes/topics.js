const express = require('express'); // Import the express module
const router = express.Router(); // Create a router object
const axios = require('axios'); // Import the axios module for making HTTP requests
const { body, validationResult } = require('express-validator'); // Import validation functions from express-validator
const authenticateToken = require('../middleware/authenticateToken'); // Import middleware for token authentication
const checkSubscription = require('../middleware/checkSubscription'); // Import middleware for subscription check

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Retrieve OpenAI API key from environment variables

// Function to generate unique topics using OpenAI API
async function generateUniqueTopics(initialTopic, model) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: model, // Use the specified model (e.g., gpt-4o or gpt-3.5-turbo)
            messages: [{ role: 'user', content: `Generate 10 semantically relevant but unique topics under the main category of ${initialTopic}` }], // Prompt for generating topics
        },
        {
            headers: {
                'Content-Type': 'application/json', // Set content type header
                Authorization: `Bearer ${OPENAI_API_KEY}`, // Set authorization header with the API key
            },
        }
    );

    const content = response.data.choices[0].message.content; // Extract content from API response
    const topics = content.split('\n') // Split content into lines
        .map(t => t.replace(/^\d+\.\s*/, '').trim()) // Remove leading numbers and trim whitespace
        .filter(t => t && !t.startsWith('-')); // Remove empty strings and lines that start with bullet points
    return topics; // Return the cleaned topics
}

// Function to generate a blog post using OpenAI API
async function generateBlogPost(topic, model) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: model, // Use the specified model (e.g., gpt-4o or gpt-3.5-turbo)
            messages: [{ role: 'user', content: `Write a 100% unique, creative and in human-like style article of a minimum of 3000 words using headings and sub-headings. There should be minimum 15 headings and 10 sub-headings in the content for the Keyword ${topic}. Try to write at least 300-400 words of content for each heading or sub-heading. bold all the headings and sub-headings using Markdown formatting. Try to use contractions, idioms, transitional phrases, interjections, dangling modifiers, and colloquialisms, and avoid repetitive phrases and unnatural sentence structures. When you write, you will correctly format the blog post according to proper SEO standards, with as much rich and detailed HTML as possible, for example, lists, bold, italics, quotes from the internet, tables, and external links to high-quality websites such as Wikipedia. Try to ask questions and then immediately give a good and concise answer, to try to achieve the featured snippet on Google. The article should include SEO meta-description (must include the ${topic} in the description), an Introduction, and a click-worthy short title. Also, Use the seed keyword as the first H2. Always use a combination of paragraphs, lists, and tables for a better reader experience. Write at least one paragraph with the heading ${topic}. Write down at least 6 faqs with answers and a conclusion. Make sure the article is plagiarism free. Don't forget to use the question mark (?) at the end of questions. Try not to change the original ${topic} while writing the Title. Try to use The ${topic} 2-3 times in the article. try to include ${topic} in headings as well. write content that can easily pass the AI detection tools test. ` }], // Prompt for generating a blog post
        },
        {
            headers: {
                'Content-Type': 'application/json', // Set content type header
                Authorization: `Bearer ${OPENAI_API_KEY}`, // Set authorization header with the API key
            },
        }
    );

    return response.data.choices[0].message.content; // Return the generated blog post content
}

// Route to generate topics
router.post('/generate-topics', authenticateToken, checkSubscription, [
    body('topic').not().isEmpty().withMessage('Topic is required').trim().escape(), // Validate and sanitize the topic field
    body('model').not().isEmpty().withMessage('Model is required').trim().escape() // Validate and sanitize the model field
], async (req, res, next) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors if validation failed
    }

    const { topic, model } = req.body; // Extract topic and model from request body

    try {
        const topics = await generateUniqueTopics(topic, model); // Generate topics using the provided topic and model
        res.json({ topics }); // Send the generated topics as a JSON response
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

// Route to generate a blog post
router.post('/generate-blog', authenticateToken, checkSubscription, [
    body('topic').not().isEmpty().withMessage('Topic is required').trim().escape(), // Validate and sanitize the topic field
    body('model').not().isEmpty().withMessage('Model is required').trim().escape() // Validate and sanitize the model field
], async (req, res, next) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors if validation failed
    }

    const { topic, model } = req.body; // Extract topic and model from request body

    try {
        const blogPost = await generateBlogPost(topic, model); // Generate a blog post using the provided topic and model
        res.json({ blogPost }); // Send the generated blog post as a JSON response
    } catch (error) {
        next(error); // Pass any errors to the next middleware (error handler)
    }
});

module.exports = router; // Export the router object to be used in other parts of the application
