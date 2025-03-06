const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

// Armazena as mensagens do chat
let messages = [];

// Rota para enviar mensagens
app.post('/send', express.json(), (req, res) => {
    const { sender, message, color } = req.body;
    if (sender && message && color) {
        messages.push({ sender, message, color });
        res.status(200).send('Mensagem enviada');
    } else {
        res.status(400).send('Dados inválidos');
    }
});

// Rota para receber mensagens (Long Polling)
app.get('/receive', (req, res) => {
    const lastMessageId = parseInt(req.query.lastMessageId) || 0;

    // Verifica se há novas mensagens a cada segundo
    const checkForNewMessages = () => {
        if (lastMessageId < messages.length) {
            res.status(200).json({
                messages: messages.slice(lastMessageId),
                lastMessageId: messages.length
            });
        } else {
            setTimeout(checkForNewMessages, 1000); // Espera 1 segundo e verifica novamente
        }
    };

    checkForNewMessages();
});

// Servir arquivos estáticos
app.use(express.static('public'));

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});