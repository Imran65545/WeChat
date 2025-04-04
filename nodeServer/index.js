//node server whichwill handle our socketio connections
// const PORT = process.env.PORT || 8000; // Use the port assigned by Render

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 10000; // ✅ define PORT first

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});





const users= {};

io.on('connection',socket=>{
    socket.on('new-user-joined', name => {  // 👈 This can still be "name"
        console.log("New user", name);  // Will receive "userName" from the client
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', () => {
        // console.log(`User disconnected: ${socket.id}`); // Log disconnect
        // if (users[socket.id]) {
            // const userName = users[socket.id];
            // console.log(`${userName} left the chat`); // Log which user left
            socket.broadcast.emit('left', users[socket.id]); // Notify others
            delete users[socket.id]; // Remove user from the list
        // } else {
        //     console.log("Unknown user disconnected");
        // }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
