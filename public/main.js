document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const enterChatButton = document.getElementById('enter-chat');

    enterChatButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            // Salva o nome no localStorage e redireciona para o chat
            localStorage.setItem('username', username);
            window.location.href = 'chat.html';
        } else {
            alert('Por favor, escolha um nome.');
        }
    });
});