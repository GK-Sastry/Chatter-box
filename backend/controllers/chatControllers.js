// Importing necessary modules
const asyncHandler = require("express-async-handler"); // Middleware to handle async errors in express
const Chat = require("../models/chatModel"); // Importing Chat model to interact with the chat data in the database
const User = require("../models/userModel"); // Importing User model to interact with user data in the database

// @description     Create or fetch One to One Chat
// @route           POST /api/chat/
// @access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Extracting the userId from the request body

  // If no userId is provided, return a 400 Bad Request status
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // Checking if a one-to-one chat already exists between the logged-in user and the requested user
  var isChat = await Chat.find({
    isGroupChat: false, // We want a one-to-one chat, not a group chat
    $and: [
      // Using $and to match the logged-in user and the requested user
      { users: { $elemMatch: { $eq: req.user._id } } }, // Check if the logged-in user is in the chat
      { users: { $elemMatch: { $eq: userId } } }, // Check if the requested user is in the chat
    ],
  }) // Retrieves the user details from the users array in the Chat model.
    .populate("users", "-password") // Populating the user details, excluding the password
    .populate("latestMessage"); // Populating the latest message in the chat from message model

  // Populating the sender details of the latest message
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email", // Selecting the sender's name, picture, and email
  });

  // If a chat is found, return the chat details
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // If no chat exists, create a new one
    var chatData = {
      chatName: "sender", // Default chat name
      isGroupChat: false, // It's not a group chat
      users: [req.user._id, userId], // Adding both users to the chat
    };

    try {
      // Creating the new chat in the database
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      ); // Fetching the full chat details

      // Sending the full chat details back as a response
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400); // If an error occurs, send a 400 Bad Request status
      throw new Error(error.message); // Throw the error message
    }
  }
});

// @description     Fetch all chats for a user
// @route           GET /api/chat/
// @access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Fetching all chats for the logged-in user
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password") // Populating user details, excluding passwords
      .populate("groupAdmin", "-password") // Populating group admin details, excluding passwords
      .populate("latestMessage") // Populating the latest message in the chat
      .sort({ updatedAt: -1 }) // Sorting chats by the most recently updated
      .then(async (results) => {
        // Populating the sender details of the latest message
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email", // Selecting sender's name, picture, and email
        });
        res.status(200).send(results); // Sending the chat data back as a response
      });
  } catch (error) {
    res.status(400); // If an error occurs, send a 400 Bad Request status
    throw new Error(error.message); // Throw the error message
  }
});

// @description     Create New Group Chat
// @route           POST /api/chat/group
// @access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    // Ensure users and name are provided in the request body
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  var users = JSON.parse(req.body.users); // Parsing the users from the request body

  if (users.length < 2) {
    // At least 2 users are needed to create a group chat
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user); // Adding the logged-in user to the list of users for the group chat

  try {
    // Creating the group chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user, // Setting the logged-in user as the group admin
    });

    // Fetching the full group chat details
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat); // Sending the full group chat data back as a response
  } catch (error) {
    res.status(400); // If an error occurs, send a 400 Bad Request status
    throw new Error(error.message); // Throw the error message
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body; // Extracting chatId and chatName from the request body

  // Updating the chat name for the given chatId
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName, // Updating the chat name
    },
    {
      new: true, // Return the updated chat
    }
  )
    .populate("users", "-password") // Populating user details, excluding passwords
    .populate("groupAdmin", "-password"); // Populating group admin details, excluding passwords

  if (!updatedChat) {
    // If the chat is not found, send a 404 Not Found status
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat); // Send the updated chat data back as a response
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body; // Extracting chatId and userId from the request body

  // Removing the user from the group chat
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }, // Using $pull to remove the user from the users array
    },
    {
      new: true, // Return the updated chat
    }
  )
    .populate("users", "-password") // Populating user details, excluding passwords
    .populate("groupAdmin", "-password"); // Populating group admin details, excluding passwords

  if (!removed) {
    // If the chat is not found, send a 404 Not Found status
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed); // Send the updated chat data back as a response
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body; // Extracting chatId and userId from the request body

  // Adding the user to the group chat
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }, // Using $push to add the user to the users array
    },
    {
      new: true, // Return the updated chat
    }
  )
    .populate("users", "-password") // Populating user details, excluding passwords
    .populate("groupAdmin", "-password"); // Populating group admin details, excluding passwords

  if (!added) {
    // If the chat is not found, send a 404 Not Found status
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added); // Send the updated chat data back as a response
  }
});

// Exporting the functions to be used in other parts of the application
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
