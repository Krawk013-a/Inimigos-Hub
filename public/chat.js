document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send-button');

    // Recupera o nome do usuário do localStorage
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'index.html'; // Redireciona se não houver nome
    }

    // Notifica que o usuário entrou no chat
    socket.emit('new user', username);

    // Enviar mensagem
    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
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

    // Notificar quando um usuário entra ou sai
    socket.on('user connected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<em>${name} entrou no chat.</em>`;
        chatWindow.appendChild(messageElement);
    });

    socket.on('user disconnected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<em>${name} saiu do chat.</em>`;
        chatWindow.appendChild(messageElement);
    });
});