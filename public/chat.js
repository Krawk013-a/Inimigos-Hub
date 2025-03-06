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

    // Função para exibir mensagens
    const displayMessage = (sender, message, color) => {
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

    // Função para enviar mensagens
    const sendMessage = async (message) => {
        const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: username, message, color: userColor })
        });

        if (!response.ok) {
            console.error('Erro ao enviar mensagem');
        }
    };

    // Função para receber mensagens (Long Polling)
    const receiveMessages = async (lastMessageId = 0) => {
        try {
            const response = await fetch(`/receive?lastMessageId=${lastMessageId}`);
            if (response.ok) {
                const data = await response.json();
                data.messages.forEach((msg) => {
                    displayMessage(msg.sender, msg.message, msg.color);
                });
                receiveMessages(data.lastMessageId); // Faz uma nova requisição
            } else {
                console.error('Erro ao receber mensagens');
                setTimeout(() => receiveMessages(lastMessageId), 1000); // Tenta novamente após 1 segundo
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setTimeout(() => receiveMessages(lastMessageId), 1000); // Tenta novamente após 1 segundo
        }
    };

    // Envia uma mensagem
    sendButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o recarregamento da página

        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
            chatInput.value = ''; // Limpa o campo de input
        }
    });

    // Inicia o Long Polling para receber mensagens
    receiveMessages();
});