import React from 'react'; // Import React to use JSX and component features
import './Loading.css'; // Import the CSS file for styling the Loading component

// Functional component to display a loading animation
function Loading() {
    return (
        <div className="loading-container"> {/* Container for the loading animation */}
            <span className="loading-text"> {/* Wrapper for the loading text */}
                {/* Map over each character in the string "Loading..." to create a span for each character */}
                {Array.from("Loading...").map((char, index) => (
                    <span key={index}>{char}</span> ))} {/* Each character is wrapped in a span with a unique key */}
            </span>
        </div>
    );
}

export default Loading; // Export the Loading component to be used in other parts of the application
