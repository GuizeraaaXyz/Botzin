const mineflayer = require('mineflayer');
const EventEmitter = require('events');

function startBot(username = 'cachorroAlt_') {
  const botEvents = new EventEmitter();
  
  const bot = mineflayer.createBot({
    host: 'naturalcraft.online',
    port: 25565,
    username: 'cachorroAlt_,
    version: '1.21.1' // força versão correta
  });

  let slotTimeout;
  let homeTimeout;

  bot.on('spawn', () => {
    botEvents.emit('log', `Bot conectado com sucesso como ${username}!`);

    setTimeout(() => {
      bot.chat('/logar 250719802023');
      botEvents.emit('log', 'Comando /logar enviado');

      slotTimeout = setTimeout(() => {
        bot.setQuickBarSlot(4); // slot 5
        bot.activateItem();
        botEvents.emit('log', 'Clicou no slot 5 com botão direito');

        homeTimeout = setTimeout(() => {
          bot.chat('/home farms');
          botEvents.emit('log', 'Executou /home farms');
        }, 5000);

      }, 3000);

    }, 3000);
  });

  // Logs do chat do servidor
  bot.on('chat', (username, message) => {
    botEvents.emit('log', `<${username}> ${message}`);
  });

  bot.on('message', (jsonMsg) => {
    botEvents.emit('log', jsonMsg.toString());
  });

  bot.on('kicked', (reason) => {
    botEvents.emit('log', `Fui kickado: ${JSON.stringify(reason)}`);
    clearTimeout(slotTimeout);
    clearTimeout(homeTimeout);
  });

  bot.on('end', () => {
    botEvents.emit('log', 'Bot desconectou');
    clearTimeout(slotTimeout);
    clearTimeout(homeTimeout);
  });

  bot.on('error', (err) => {
    botEvents.emit('log', `Erro do bot: ${err}`);
  });

  // Funções extras para controlar o bot
  botEvents.sendChat = (msg) => {
    if (bot && bot.chat) bot.chat(msg);
  };

  botEvents.kickBot = () => {
    if (bot) bot.quit('Bot kickado manualmente');
  };

  return botEvents;
}

module.exports = { startBot };

