document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatWindow = document.getElementById('chat-window');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send-button');

    let username = '';

    // Escolher nome de usuário
    usernameInput.addEventListener('change', (e) => {
        username = e.target.value;
        socket.emit('new user', username);
    });

    // Enviar mensagem
    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message && username) {
            socket.emit('chat message', { username, message });
            messageInput.value = '';
        }
    });

    // Receber mensagens
    socket.on('chat message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    // Novo usuário conectado
    socket.on('user connected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<em>${name} entrou no chat.</em>`;
        chatWindow.appendChild(messageElement);
    });
});