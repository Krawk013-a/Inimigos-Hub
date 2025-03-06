document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat__messages');
    const chatForm = document.querySelector('.chat__form');
    const chatInput = document.querySelector('.chat__input');
    const sendButton = document.getElementById('send-button');

    // Recupera o nome do usuário do localStorage
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'index.html'; // Redireciona se não houver nome
    }

    // Cores aleatórias para os usuários
    const colors = ["cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", "gold"];
    const userColor = colors[Math.floor(Math.random() * colors.length)];

    // Conecta ao servidor WebSocket
    const websocket = new WebSocket('wss://inimigos-hub-o9ml.onrender.com');

    // Quando a conexão é aberta
    websocket.onopen = () => {
        console.log('Conectado ao servidor WebSocket');
    };

    // Quando uma mensagem é recebida
    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { sender, message, color } = data;

        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === username ? 'message--self' : 'message--other');

        if (sender !== username) {
            const senderElement = document.createElement('span');
            senderElement.classList.add('message--sender');
            senderElement.style.color = color;
            senderElement.textContent = sender;
            messageElement.appendChild(senderElement);
        }

        messageElement.innerHTML += message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Envia uma mensagem
    sendButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão

        const message = chatInput.value.trim();
        if (message) {
            const data = {
                sender: username,
                message: message,
                color: userColor
            };
            websocket.send(JSON.stringify(data));
            chatInput.value = ''; // Limpa o campo de input
        }
    });
});