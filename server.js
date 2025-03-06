const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir arquivos estáticos
app.use(express.static('public'));

// Configuração do Socket.IO
io.on('connection', (socket) => {
    console.log('Um usuário conectou');

    // Quando um novo usuário entra
    socket.on('new user', (username) => {
        socket.username = username;
        io.emit('user connected', username);
    });

    // Quando uma mensagem é enviada
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    // Quando um usuário desconecta
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('user disconnected', socket.username);
        }
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});