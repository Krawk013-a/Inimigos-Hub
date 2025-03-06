const http = require('http');
const WebSocket = require('ws');

// Cria um servidor HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
});

// Cria um servidor WebSocket
const wss = new WebSocket.Server({ server });

// Quando um cliente se conecta
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Quando o servidor recebe uma mensagem
    ws.on('message', (message) => {
        console.log('Mensagem recebida:', message.toString());

        // Envia a mensagem para todos os clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // Quando o cliente desconecta
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Inicia o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor WebSocket rodando na porta 3000');
});