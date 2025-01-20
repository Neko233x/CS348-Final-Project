import React, { useState } from 'react'; // Import React and useState hook
import './App.css'; // Import CSS file for styling

function App() {
  const [url, setUrl] = useState(''); // State to store the user's input
  const [message, setMessage] = useState(''); // State to store the validation result message

  // Function to validate the URL using a regular expression
  const validateUrl = (input) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // Match the protocol (http or https)
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // Match the domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // Match IP address
      '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // Match port and path
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // Match query parameters
      '(\\#[-a-zA-Z\\d_]*)?$', // Match fragment identifiers
      'i' // Case-insensitive flag
    );
    return urlPattern.test(input); // Return true if the input matches the pattern, otherwise false
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (validateUrl(url)) {
      // If the URL is valid
      setMessage(`✅ The URL "${url}" is valid.`); // Display a success message
    } else {
      // If the URL is invalid
      setMessage('❌ Invalid URL. Please enter a valid URL (e.g., http://example.com).'); // Display an error message
    }
  };

  // Render the application
  return (
    <div className="App">
      {/* Header section */}
      <header className="App-header">
        <h1>URL Validator</h1> {/* Title of the application */}

        {/* Form to accept user input */}
        <form onSubmit={handleSubmit}>
          {/* Input field for the user to enter a URL */}
          <input
            type="text"
            placeholder="Enter a URL (e.g., http://example.com)" // Placeholder text
            value={url} // Bind input value to state
            onChange={(e) => setUrl(e.target.value)} // Update state when user types
            className="url-input" // CSS class for styling
          />
          {/* Button to submit the form */}
          <button type="submit" className="validate-button">
            Validate
          </button>
        </form>

        {/* Display the validation result message */}
        {message && <p className="message">{message}</p>}
      </header>
    </div>
  );
}

export default App; // Export the App component as default
