// Import the jsonwebtoken library, which is used to generate and verify JWTs (JSON Web Tokens).
const jwt = require("jsonwebtoken");

// Define a function that generates a JWT for a given user ID.
const generateToken = (id) => {
  // Use the `sign` method from the `jsonwebtoken` library to create the token.
  // Arguments:
  // 1. Payload: The data to embed in the token. Here, we're including the user's ID.
  // 2. Secret Key: The secret key (from environment variables) used to sign the token. This ensures the token's integrity.
  // 3. Options: Additional configuration options for the token, such as its expiration time.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // The token will expire in 30 days. After that, the user will need to log in again.
  });
};

// Export the function so it can be used in other parts of the application.
module.exports = generateToken;
