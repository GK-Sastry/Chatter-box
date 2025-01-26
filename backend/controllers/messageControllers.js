// Importing necessary modules
const asyncHandler = require("express-async-handler"); // Middleware for handling async errors in Express
const Message = require("../models/messageModel"); // Importing Message model to interact with message data in the database
const User = require("../models/userModel"); // Importing User model to interact with user data in the database
const Chat = require("../models/chatModel"); // Importing Chat model to interact with chat data in the database

// @description     Get all Messages for a specific chat
// @route           GET /api/Message/:chatId
// @access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    // Fetching all messages for a specific chat using the chatId from the request URL parameters
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email") // Populating sender's name, picture, and email, excluding the password
      .populate("chat"); // Populating chat details (the chat the message belongs to)

    // Sending the retrieved messages as a JSON response
    res.json(messages);
  } catch (error) {
    res.status(400); // If an error occurs, send a 400 Bad Request status
    throw new Error(error.message); // Throw the error message
  }
});

// @description     Create and send a new message in a chat
// @route           POST /api/Message/
// @access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body; // Extracting the content and chatId from the request body

  // If content or chatId is missing, return a 400 Bad Request status
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // Constructing the message data with the sender's ID, content, and chatId
  var newMessage = {
    sender: req.user._id, // Setting the sender as the logged-in user
    content: content, // Setting the content of the message
    chat: chatId, // Setting the chat the message belongs to
  };

  try {
    // Creating a new message in the database
    var message = await Message.create(newMessage);

    // Populating the sender's details (name and pic)
    message = await message.populate("sender", "name pic").execPopulate();
    // Populating the chat details
    message = await message.populate("chat").execPopulate();
    // Populating the users in the chat with their details (name, pic, email)
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email", // Selecting name, picture, and email for each user in the chat
    });

    // Updating the latest message in the chat document with the newly created message
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    // Sending the created message as a JSON response
    res.json(message);
  } catch (error) {
    res.status(400); // If an error occurs, send a 400 Bad Request status
    throw new Error(error.message); // Throw the error message
  }
});

// Exporting the functions to be used in other parts of the application
module.exports = { allMessages, sendMessage };
