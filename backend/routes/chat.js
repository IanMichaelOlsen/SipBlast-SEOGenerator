const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/authenticateToken');
const checkSubscription = require('../middleware/checkSubscription');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateUniqueTopics(initialTopic) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Generate 10 semantically relevant but unique topics under the main category of ${initialTopic}` }],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
        }
    );

    const topics = response.data.choices[0].message.content.split('\n').map(t => t.trim()).filter(t => t);
    return topics;
}

async function generateBlogPost(topic) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Write a 100% unique, creative and in human-like style article of a minimum of 3000 words using headings and sub-headings. There should be minimum 15 headings and 10 sub-headings in the content for the Keyword ${topic}. Try to write at least 300-400 words of content for each heading or sub-heading. bold all the headings and sub-headings using Markdown formatting. Try to use contractions, idioms, transitional phrases, interjections, dangling modifiers, and colloquialisms, and avoid repetitive phrases and unnatural sentence structures. When you write, you will correctly format the blog post according to proper SEO standards, with as much rich and detailed HTML as possible, for example, lists, bold, italics, quotes from the internet, tables, and external links to high-quality websites such as Wikipedia. Try to ask questions and then immediately give a good and concise answer, to try to achieve the featured snippet on Google. The article should include SEO meta-description (must include the ${topic} in the description), an Introduction, and a click-worthy short title. Also, Use the seed keyword as the first H2. Always use a combination of paragraphs, lists, and tables for a better reader experience. Write at least one paragraph with the heading ${topic}. Write down at least 6 faqs with answers and a conclusion. Make sure the article is plagiarism free. Don't forget to use the question mark (?) at the end of questions. Try not to change the original ${topic} while writing the Title. Try to use The ${topic} 2-3 times in the article. try to include ${topic} in headings as well. write content that can easily pass the AI detection tools test. ` }],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
        }
    );

    return response.data.choices[0].message.content;
}

router.post('/generate-topics', authenticateToken, checkSubscription, [
    body('topic').not().isEmpty().withMessage('Topic is required').trim().escape()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { topic } = req.body;

    try {
        const topics = await generateUniqueTopics(topic);
        res.json({ topics });
    } catch (error) {
        next(error);
    }
});

router.post('/generate-blog', authenticateToken, checkSubscription, [
    body('topic').not().isEmpty().withMessage('Topic is required').trim().escape()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { topic } = req.body;

    try {
        const blogPost = await generateBlogPost(topic);
        res.json({ blogPost });
    } catch (error) {
        next(error);
    }
});

module.exports = router;