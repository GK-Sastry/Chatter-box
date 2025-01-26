// Import the required modules
const mongoose = require("mongoose"); // Library for interacting with MongoDB
const bcrypt = require("bcryptjs"); // Library for hashing passwords

// Define the schema (structure) for the 'User' collection in the database
const userSchema = mongoose.Schema(
  {
    // Field for the user's name
    name: {
      type: "String", // Data type: String
      required: true, // This field is mandatory
    },
    // Field for the user's email
    email: {
      type: "String", // Data type: String
      unique: true, // This value must be unique across all documents (no duplicate emails)
      required: true, // This field is mandatory
    },
    // Field for the user's password
    password: {
      type: "String", // Data type: String
      required: true, // This field is mandatory
    },
    // Field for the user's profile picture (optional)
    pic: {
      type: "String", // Data type: String (URL of the picture)
      required: true, // This field is mandatory
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", // Default value if no picture is provided
    },
    // Field for admin status
    isAdmin: {
      type: Boolean, // Data type: Boolean (true/false)
      required: true, // This field is mandatory
      default: false, // Default value is `false` (not an admin)
    },
  },
  // Schema options
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps
);

// Instance method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt to compare the entered password with the stored hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware: This function runs before saving a user document to the database
userSchema.pre("save", async function (next) {
  // Check if the password field has been modified
  if (!this.isModified) {
    next(); // If not modified, proceed to the next middleware or save operation
  }

  // Generate a salt for hashing the password
  const salt = await bcrypt.genSalt(10);

  // Hash the user's password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a Mongoose model named 'User' using the defined schema
const User = mongoose.model("User", userSchema);

// Export the 'User' model so it can be used in other parts of the application
module.exports = User;
