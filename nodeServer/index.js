//node server whichwill handle our socketio connections
const io = require("socket.io")(8000, {
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
