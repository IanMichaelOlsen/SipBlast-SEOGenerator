import React, { useState } from 'react';
import axios from 'axios';
import Loading from './Loading'; // Import the Loading component
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import './App.css';

const API_URL = 'http://localhost:3000/api'; // Adjust based on your backend URL

function App() {
  // Define state variables using useState hook
  const [topic, setTopic] = useState(''); // State to hold the topic input by the user
  const [topics, setTopics] = useState([]); // State to hold the generated topics
  const [selectedTopic, setSelectedTopic] = useState(''); // State to hold the selected topic
  const [blogPost, setBlogPost] = useState(''); // State to hold the generated blog post
  const [email, setEmail] = useState(''); // State to hold the email input by the user
  const [password, setPassword] = useState(''); // State to hold the password input by the user
  const [token, setToken] = useState(''); // State to hold the authentication token
  const [loadingLogin, setLoadingLogin] = useState(false); // Separate loading state for login
  const [loadingRegister, setLoadingRegister] = useState(false); // Separate loading state for registration
  const [loadingTopics, setLoadingTopics] = useState(false); // Separate loading state for topic generation
  const [loadingBlog, setLoadingBlog] = useState(false); // Separate loading state for blog post generation
  const [error, setError] = useState(''); // State to hold error messages
  const [success, setSuccess] = useState(''); // State to hold success messages
  const [showTopics, setShowTopics] = useState(false); // State to manage the visibility of the topics section
  const [showBlogPost, setShowBlogPost] = useState(false); // State to manage the visibility of the blog post section
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage the visibility of the login form
  const [model, setModel] = useState('gpt-4o'); // State to manage the selected model

  // Function to handle user login
  const handleLogin = async () => {
    setLoadingLogin(true); // Set loading state for login
    setError(''); // Clear any existing error messages
    setSuccess(''); // Clear any existing success messages

    try {
      // Make API request to login
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      setToken(response.data.accessToken); // Set authentication token
      localStorage.setItem('token', response.data.accessToken); // Store token in local storage
      setError(''); // Clear error message if login is successful
      setSuccess('Login successful!'); // Set success message
      setIsLoggedIn(true); // Set login state to true
    } catch (error) {
      // Handle errors during login
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the error message from the API
      } else if (error.response && error.response.data.errors) {
        // Handle validation errors
        const messages = error.response.data.errors.map(err => err.msg).join(', ');
        setError(messages);
      } else {
        setError('An unexpected error occurred during login.');
      }
    } finally {
      setLoadingLogin(false); // Clear loading state for login
    }
  };

  // Function to handle user registration
  const handleRegister = async () => {
    setLoadingRegister(true); // Set loading state for registration
    setError(''); // Clear any existing error messages
    setSuccess(''); // Clear any existing success messages

    try {
      // Make API request to register
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password
      });
      setError(''); // Clear error message if registration is successful
      alert('Registration successful! Please log in.'); // Alert the user about successful registration
    } catch (error) {
      // Handle errors during registration
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the error message from the API
      } else if (error.response && error.response.data.errors) {
        // Handle validation errors
        const messages = error.response.data.errors.map(err => err.msg).join(', ');
        setError(messages);
      } else {
        setError('An unexpected error occurred during registration.');
      }
    } finally {
      setLoadingRegister(false); // Clear loading state for registration
    }
  };

  // Function to handle topic generation
  const handleGenerateTopics = async () => {
    setLoadingTopics(true); // Set loading state for topic generation
    setError(''); // Clear any existing error messages
    setSuccess(''); // Clear any existing success messages
    setSelectedTopic(''); // Clear selected topic
    setBlogPost(''); // Clear blog post
    setShowTopics(false); // Hide topics section initially
    setShowBlogPost(false); // Hide blog post section initially

    try {
      // Make API request to generate topics
      const response = await axios.post(`${API_URL}/topics/generate-topics`, { topic, model }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTopics(response.data.topics); // Set generated topics
      setShowTopics(true); // Show topics section after fetching topics
      setError(''); // Clear error message if topics are successfully generated
    } catch (error) {
      // Handle errors during topic generation
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the error message from the API
      } else {
        setError('An unexpected error occurred while generating topics.');
      }
    } finally {
      setLoadingTopics(false); // Clear loading state for topic generation
    }
  };

  // Function to handle blog post generation
  const handleGenerateBlog = async () => {
    setLoadingBlog(true); // Set loading state for blog post generation
    setError(''); // Clear any existing error messages
    setSuccess(''); // Clear any existing success messages
    setShowTopics(false); // Hide topics section

    try {
      // Make API request to generate blog post
      const response = await axios.post(`${API_URL}/topics/generate-blog`, { topic: selectedTopic, model }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBlogPost(response.data.blogPost); // Set generated blog post
      setShowBlogPost(true); // Show blog post section
      setError(''); // Clear error message if blog post is successfully generated
      setSuccess('Blog post generated successfully!'); // Set success message
    } catch (error) {
      // Handle errors during blog post generation
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the error message from the API
      } else {
        setError('An unexpected error occurred while generating the blog post.');
      }
    } finally {
      setLoadingBlog(false); // Clear loading state for blog post generation
    }
  };

  // Render the component
  return (
      <div className={`App ${loadingLogin || loadingRegister || loadingTopics || loadingBlog ? 'overflow-hidden' : ''}`}>
        <h1 className="app-title">ChatGPT Blog Post Generator</h1>
        {error && <div className="error-message">{error}</div>} {/* Display error message if any */}
        {success && <div className="success-message">{success}</div>} {/* Display success message if any */}
        {!isLoggedIn && (
            <div className="auth-container">
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
              />
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
              />
              <div className="button-container">
                <button onClick={handleLogin} disabled={loadingLogin} className="auth-button">
                  {loadingLogin ? 'Logging in...' : 'Login'}
                </button>
                <button onClick={handleRegister} disabled={loadingRegister} className="auth-button">
                  {loadingRegister ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>
        )}
        {isLoggedIn && (
            <>
              <div className="model-container">
                <label>
                  <input
                      type="radio"
                      value="gpt-4o"
                      checked={model === 'gpt-4o'}
                      onChange={() => setModel('gpt-4o')}
                      className="model-radio"
                  />
                  GPT-4o
                </label>
                <label>
                  <input
                      type="radio"
                      value="gpt-3.5-turbo"
                      checked={model === 'gpt-3.5-turbo'}
                      onChange={() => setModel('gpt-3.5-turbo')}
                      className="model-radio"
                  />
                  GPT-3.5 Turbo
                </label>
              </div>
              <div className="topic-container">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic"
                    className="input-field"
                />
                <button onClick={handleGenerateTopics} disabled={loadingTopics} className="generate-button">
                  {loadingTopics ? 'Generating...' : 'Generate Topics'}
                </button>
              </div>
            </>
        )}
        {loadingTopics && <Loading />} {/* Display Loading component when generating topics */}
        {showTopics && topics.length > 0 && (
            <div className="topics-list">
              <h2>Select a Topic</h2>
              <ul>
                {topics.map((t, index) => (
                    <li key={index} onClick={() => setSelectedTopic(t)} className="topic-item">
                      {t}
                    </li>
                ))}
              </ul>
            </div>
        )}
        {selectedTopic && !loadingBlog && (
            <div className="generate-blog-container">
              <h2>Selected Topic: {selectedTopic}</h2>
              <button onClick={handleGenerateBlog} disabled={loadingBlog} className="generate-button">
                {loadingBlog ? 'Generating...' : 'Generate Blog Post'}
              </button>
            </div>
        )}
        {loadingBlog && <Loading />} {/* Display Loading component when generating blog post */}
        {showBlogPost && blogPost && (
            <div className="blog-post-container">
              <h2>Generated Blog Post</h2>
              <ReactMarkdown className="blog-post" children={blogPost} /> {/* Display the blog post using react-markdown */}
            </div>
        )}
      </div>
  );
}

export default App; // Export the App component
