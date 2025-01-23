const express = require('express'); // Import Express framework
const { resolveDomain } = require('../utils/dnsResolver'); // Import the resolveDomain function
const router = express.Router(); // Create an Express router instance

/**
 * Validate domain format
 * @param {string} domain - The domain to validate
 * @returns {boolean} - Returns true if the domain format is valid, otherwise false
 */
function isValidDomain(domain) {
  const domainPattern = /^[a-zA-Z\d-]{1,63}(\.[a-zA-Z\d-]{1,63})+$/; // Regular expression for valid domain names
  return domainPattern.test(domain); // Test if the domain matches the pattern
}

// POST route: Handle domain resolution requests
router.post('/resolve', async (req, res) => {
  const { domain } = req.body; // Extract the domain from the request body

  // Validate the domain format
  if (!domain || !isValidDomain(domain)) {
    return res.status(400).json({ error: 'Invalid domain format' }); // Return a 400 error if the domain is invalid
  }

  try {
    // Call the resolveDomain function to perform DNS resolution
    const result = await resolveDomain(domain);
    res.json({ domain, result }); // Respond with the resolved domain and its result
  } catch (error) {
    // Handle errors and respond with a 500 status code
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Export the router to be used in other parts of the application
