const express = require("express");
var mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");

const app = express();
require("dotenv").config();
mongoose
  .connect("mongodb://127.0.0.1:27017/Chat-app")
  .then(() => console.log("Conneted to DB!"));

app.use("/", userRoute);

const port = process.env.PORT || 5000;
const http = require("http").Server(app);

const io = require("socket.io")(http);
var usp = io.of("/user-namespace"); //create a namespace for users
usp.on("connection", async function (socket) {
  console.log("User Connected");

  var userId = socket.handshake.auth.token;
  await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: "1" } });

  //broadcasting the user online status
  socket.broadcast.emit("getOnlineUser", { user_id: userId });

  socket.on("disconnect", async function () {
    console.log("User disconnected");
    var userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: "0" } });

    //broadcasting the user offline status
    socket.broadcast.emit("getOfflineUser", { user_id: userId });
  });

  // chatting implementation
  socket.on("newChat", function (data) {
    socket.broadcast.emit("loadNewChat", data);
  });

  // load old chat
  socket.on("existsChat", async function (data) {
    var chats = await Chat.find({
      $or: [
        { sender_id: data.sender_id, receiver_id: data.receiver_id },
        { sender_id: data.receiver_id, receiver_id: data.sender_id },
      ],
    });

    socket.emit("loadChats", { chats: chats });
  });

  // delete chat
  socket.on('chatDeleted', function(id){
    socket.broadcast.emit('chatMessageDeleted', id);
  });


  // Update chat
  socket.on('chatUpdated', function(data){
    socket.broadcast.emit('chatMessageUpdated', data);
  });

});

http.listen(port, function () {
  console.log(`Server running on port: ${port}`);
});
