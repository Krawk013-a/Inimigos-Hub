const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new user', (username) => {
        socket.username = username;
        io.emit('user connected', username);
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('user disconnected', socket.username);
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
