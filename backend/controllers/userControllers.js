const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { OAuth2Client } = require("google-auth-library");

// Initialize Google OAuth2Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @description     Google Registration/Login (Single Endpoint)
// @route           POST /api/user/google-auth
// @access          Public
const googleAuth = asyncHandler(async (req, res) => {
  const { googleToken, pic } = req.body;

  if (!googleToken) {
    res.status(400);
    throw new Error("Google token is required");
  }

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user with Google details
      user = new User({
        name: payload.name,
        email: payload.email,
        pic: payload.picture || pic,
        password: "", // No password for Google users
      });
      await user.save();
    }

    // Generate a JWT token for the user (for session management)
    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token,
    });
  } catch (error) {
    res.status(401);
    throw new Error("Google authentication failed");
  }
});

// @description     Google Callback (Server-side)
const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.status(400);
    throw new Error("No code provided");
  }

  try {
    // Use the code to get the tokens from Google
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI, // Replace with your redirect URI
    });

    // Verify the ID token from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID, // Your Google OAuth client ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user with Google details
      user = new User({
        name: payload.name,
        email: payload.email,
        pic: payload.picture,
        password: "", // No password for Google users
      });
      await user.save();
    }

    // Redirect or send response with token and user info
    res.redirect(
      `${process.env.FRONTEND_URL}/?token=${generateToken(user._id)}` // Redirect to the frontend with token
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.status(500).send("Google authentication failed");
  }
});

// @description     Regular Registration (Email/Password)
// @route           POST /api/user/register
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create the user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User registration failed");
  }
});

// @description     Regular Login (Email/Password)
// @route           POST /api/user/login
// @access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  // Check if the user exists
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @description     Get or Search all users
// @route           GET /api/users?search=
// @access          Private
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {
  googleAuth,
  googleCallback,
  registerUser,
  authUser,
  allUsers,
};
