document.addEventListener('DOMContentLoaded', () => {
    const login = document.querySelector('.login');
    const loginForm = login.querySelector('.login__form');
    const loginInput = login.querySelector('.login__input');

    const user = { id: "", name: "", color: "" };

    const getRandomColor = () => {
        const colors = ["cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", "gold"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        user.id = crypto.randomUUID();
        user.name = loginInput.value.trim();
        user.color = getRandomColor();

        if (user.name) {
            // Salva o usuário no localStorage e redireciona para o chat
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'chat.html';
        } else {
            alert('Por favor, escolha um nome.');
        }
    });
});