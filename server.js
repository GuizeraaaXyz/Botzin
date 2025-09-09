const express = require('express');
const { startBot } = require('./bot');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
let botLogEmitter;

app.use(express.static('public'));
app.use(bodyParser.json());

// Rota para iniciar o bot
app.post('/start-bot', (req, res) => {
  const { username } = req.body;
  botLogEmitter = startBot(username || 'cachorroAlt_'); 
  res.send('Bot iniciado!');
});

// Rota para enviar comando via input
app.post('/send-chat', (req, res) => {
  const { message } = req.body;
  if (botLogEmitter) botLogEmitter.sendChat(message);
  res.send('Comando enviado!');
});

// Rota para kitar o bot
app.post('/kick-bot', (req, res) => {
  if (botLogEmitter) botLogEmitter.kickBot();
  res.send('Bot kickado!');
});

// Rota SSE para enviar logs em tempo real
app.get('/logs', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendLog = (msg) => res.write(`data: ${msg}\n\n`);

  if (botLogEmitter) botLogEmitter.on('log', sendLog);

  req.on('close', () => {
    if (botLogEmitter) botLogEmitter.off('log', sendLog);
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
