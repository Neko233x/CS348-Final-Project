import React, { useState } from 'react'; // Import React and the useState hook for state management
import './App.css'; // Import CSS file for styling the component

function App() {
  const [url, setUrl] = useState(''); // State to store the user-inputted URL
  const [message, setMessage] = useState(''); // State to store the message to display
  const [isLoading, setIsLoading] = useState(false); // State to track the loading status

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true); // Set the loading state to true
    setMessage(''); // Clear any previous messages

    try {
      // Send a POST request to the backend with the user-inputted URL
      const response = await fetch('http://localhost:3000/api/dns/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Specify JSON content type
        body: JSON.stringify({ domain: url }), // Convert the URL data to JSON format
      });

      const data = await response.json(); // Parse the JSON response from the backend
      if (response.ok) {
        // If the response is successful, display the resolved IP address
        setMessage(`✅ ${data.domain} resolves to ${data.result.join(', ')}`);
      } else {
        // If the response has an error, display the error message
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      // Handle any network or server connection errors
      setMessage('❌ Error connecting to the server.');
    } finally {
      setIsLoading(false); // Reset the loading state to false after the request completes
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Validator</h1> {/* Title of the application */}
        <form onSubmit={handleSubmit}>
          <input
            type="text" // Input type for URL
            placeholder="Enter a URL (e.g., http://example.com)" // Placeholder text for the input field
            value={url} // Bind the input value to the state
            onChange={(e) => setUrl(e.target.value)} // Update the state when the user types
            className="url-input" // CSS class for styling the input field
          />
          <button type="submit" className="validate-button" disabled={isLoading}>
            {isLoading ? 'Validating...' : 'Validate'} {/* Show "Validating..." while loading */}
          </button>
        </form>
        {message && <p className="message">{message}</p>} {/* Display the message if it exists */}
      </header>
    </div>
  );
}

export default App; // Export the App componen
