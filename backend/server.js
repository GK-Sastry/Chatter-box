const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

// Listen for new client connections
// here the socket object is passed by the connection
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Handle user setup
  socket.on("setup", (userData) => {
    // Join a room based on the user's ID
    socket.join(userData._id);
    // Notify the client that they are connected
    socket.emit("connected");
  });

  // Allow users to join a chat room
  socket.on("join chat", (room) => {
    // Add the user to the specified room
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // Notify others in the room when a user is typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  // Notify others in the room when a user stops typing
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // Handle new message events
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    // Ensure the chat object has users
    if (!chat.users) return console.log("chat.users not defined");

    // Notify all users in the chat except the sender
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return; // Skip the sender

      // Send the message to the user's room
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // Handle disconnection
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    // Leave the room associated with the user
    socket.leave(userData._id);
  });
});
