const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Um usuário conectou');

    // Quando um novo usuário entra
    socket.on('new user', (user) => {
        socket.user = user;
        io.emit('user connected', user.name);
    });

    // Quando uma mensagem é enviada
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    // Quando um usuário desconecta
    socket.on('disconnect', () => {
        if (socket.user) {
            io.emit('user disconnected', socket.user.name);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});