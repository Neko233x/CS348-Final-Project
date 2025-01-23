const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware for handling cross-origin requests
const dnsRoutes = require('./routes/dnsRoutes'); // Import DNS routes module

const app = express(); // Create an Express application
const port = 3000; // Define the port on which the server will run

// Middleware
app.use(cors()); // Enable CORS to allow requests from different origins
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api/dns', dnsRoutes); // Mount DNS-related routes at the /api/dns endpoint

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`); // Log a message indicating the server is running
});
