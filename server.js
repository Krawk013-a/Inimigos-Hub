const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Quando uma mensagem é recebida
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Mensagem recebida:', data);

        // Envia a mensagem para todos os clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    // Quando o cliente desconecta
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});
