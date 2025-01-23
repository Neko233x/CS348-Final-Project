const dns = require('dns').promises; // Import Node.js DNS module with promise support

// Dynamic list of root servers (can be managed in a config file)
const ROOT_SERVERS = [
  '8.8.8.8',    // Google DNS
  '1.1.1.1',    // Cloudflare DNS
];

// Cache object to store resolution results
const cache = {};

/**
 * Recursively resolve a domain name
 * @param {string} domain - The domain to resolve
 * @param {string[]} currentServers - The current list of DNS servers to query
 * @returns {Promise<string[]>} - The resolved IP address list
 */
async function resolveDomainRecursive(domain, currentServers = ROOT_SERVERS) {
  // Check if the domain is already in the cache
  if (cache[domain]) {
    console.log(`Cache hit for ${domain}`);
    return cache[domain];
  }

  // Split the domain into parts for recursive resolution
  const domainParts = domain.split('.');
  const query = domainParts.join('.'); // Join the domain parts for the current query

  // Termination condition for recursion: no domain parts left
  if (!domainParts.length) {
    throw new Error('No valid response from DNS servers');
  }

  // Loop through the current list of DNS servers
  for (const server of currentServers) {
    try {
      console.log(`Querying ${query} at server ${server}`);
      const answers = await dns.resolve(query, 'A'); // Query the A record for the domain
      if (answers.length > 0) {
        cache[domain] = answers; // Cache the resolved addresses
        return answers; // Return the resolved addresses
      }
    } catch (error) {
      if (error.code === 'ENODATA') {
        try {
          // Query NS records (authoritative name servers)
          const nsRecords = await dns.resolveNs(query);
          const nextServers = nsRecords.map(ns => ns); // Extract the next servers to query

          // Recursive call to resolve the next level of the domain
          return await resolveDomainRecursive(domain, nextServers);
        } catch (nsError) {
          console.error(`Failed to query NS records for ${query}: ${nsError.message}`);
        }
      } else if (error.code === 'ENOTFOUND') {
        console.error(`Domain ${query} not found.`);
        throw new Error('Domain not found');
      } else {
        console.error(`Query to ${server} failed: ${error.message}`);
      }
    }
  }

  // Throw an error if no servers returned a valid response
  throw new Error('No valid response from DNS servers');
}

/**
 * Public-facing resolution interface
 * @param {string} domain - The domain to resolve
 * @returns {Promise<string[]>} - The resolved IP address list
 */
async function resolveDomain(domain) {
  return await resolveDomainRecursive(domain); // Call the recursive resolver
}

module.exports = { resolveDomain }; // Export the resolveDomain function
