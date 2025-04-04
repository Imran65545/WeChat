//node server whichwill handle our socketio connections
// const PORT = process.env.PORT || 8000; // Use the port assigned by Render
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.static("public")); // If you have static files

// ✅ Add this route to handle root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Your Socket.IO or other logic...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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

