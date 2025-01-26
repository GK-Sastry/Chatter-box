// Importing necessary modules
const mongoose = require("mongoose"); // Mongoose is a library that makes it easier to interact with MongoDB in Node.js
const colors = require("colors"); // The 'colors' library is used to color the console output for better readability

// Defining an asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempting to connect to MongoDB using the connection URI stored in environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Telling mongoose to use the new URL parser for better compatibility
      useUnifiedTopology: true, // Enabling the unified topology option to deal with server selections and monitoring better
    });

    // If connection is successful, log the host name of the MongoDB server to the console in cyan color
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // If there is an error connecting, log the error message in red and bold
    console.error(
      `Error: ${error.message}`.red.bold,
      "the error occured in the connect db part "
    );

    // Exit the process with a non-zero status code to indicate an error occurred
    process.exit(1); // The '1' means the process ended due to an error
  }
};

// Exporting the connectDB function to be used in other parts of the application
module.exports = connectDB;
