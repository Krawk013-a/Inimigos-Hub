document.addEventListener('DOMContentLoaded', () => {
    const chat = document.querySelector('.chat');
    const chatForm = chat.querySelector('.chat__form');
    const chatInput = chat.querySelector('.chat__input');
    const chatMessages = chat.querySelector('.chat__messages');

    // Recupera o usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html'; // Redireciona se não houver usuário
    }

    // Conecta ao servidor Socket.IO
    const socket = io();

    // Notifica que o usuário entrou no chat
    socket.emit('new user', user);

    // Cria uma mensagem enviada por você
    const createMessageSelfElement = (content) => {
        const div = document.createElement('div');
        div.classList.add('message--self');
        div.innerHTML = content;
        return div;
    };

    // Cria uma mensagem enviada por outro usuário
    const createMessageOtherElement = (content, sender, senderColor) => {
        const div = document.createElement('div');
        const span = document.createElement('span');

        div.classList.add('message--other');
        span.classList.add('message--sender');
        span.style.color = senderColor;

        span.innerHTML = sender;
        div.appendChild(span);
        div.innerHTML += content;

        return div;
    };

    // Envia uma mensagem
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = chatInput.value.trim();
        if (message) {
            socket.emit('chat message', { user, content: message });
            chatInput.value = '';
        }
    });

    // Recebe uma mensagem
    socket.on('chat message', (data) => {
        const { user: sender, content } = data;
        const messageElement =
            sender.id === user.id
                ? createMessageSelfElement(content)
                : createMessageOtherElement(content, sender.name, sender.color);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Notifica quando um usuário entra ou sai
    socket.on('user connected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<em>${name} entrou no chat.</em>`;
        chatMessages.appendChild(messageElement);
    });

    socket.on('user disconnected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<em>${name} saiu do chat.</em>`;
        chatMessages.appendChild(messageElement);
    });
});