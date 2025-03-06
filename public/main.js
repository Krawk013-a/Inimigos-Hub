document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login__form');
    const loginInput = document.querySelector('.login__input');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = loginInput.value.trim();
        if (username) {
            // Salva o nome no localStorage e redireciona para o chat
            localStorage.setItem('username', username);
            window.location.href = 'chat.html';
        } else {
            alert('Por favor, escolha um nome.');
        }
    });
});