const socket = io("https://socket-chat-backend-fzrl.onrender.com");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
audio  = new Audio('ting.mp3');

form.addEventListener('submit',(e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);  // FIX: Changed messageInput.value to message
    messageInput.value = ''

})

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');  // FIX: Changed classlist to classList
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){
        audio.play();
    }else{
        console.log("Audio not played for right position"); // Debugging message
    }
    
}

const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// Append message for the current user
append(`You joined the chat`, 'left');  

 

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');  // This message now gets added
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message} `, 'left');  // This message now gets added
});

socket.on('left', (name) => {
    console.log("User left:", name);
    append(`${name} left the chat`, 'right');
});
