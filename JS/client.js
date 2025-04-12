const socket = io("https://socket-chat-backend-fzrl.onrender.com");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const audio = new Audio('ting.mp3');

// 🔔 Ask for notification permission on page load
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    // 🔊 Play notification sound for incoming messages
    if (position === 'left') {
        audio.play();
    }
};

const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);
append(`You joined the chat`, 'left');

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');

    // 🔔 Show push notification if tab is hidden
    if (document.hidden && Notification.permission === "granted") {
        new Notification("New message from " + data.name, {
            body: data.message,
            icon: "https://raw.githubusercontent.com/Imran65545/WeChat/main/vector-chat-icon.jpg"
 // ✅ Replace this with your real repo link
        });
    }
});

socket.on('left', (name) => {
    append(`${name} left the chat`, 'right');
});
