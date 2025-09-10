const mineflayer = require('mineflayer');
const EventEmitter = require('events');

function startBot(username = `cachorroAlt_${Math.floor(Math.random() * 1000)}`) {
  const botEvents = new EventEmitter();

  let bot;
  let slotTimeout;
  let homeTimeout;

  const createBot = () => {
    bot = mineflayer.createBot({
      host: 'naturalcraft.online',
      port: 25565,
      username: username,
      version: '1.21.1'
    });

    bot.on('spawn', () => {
      botEvents.emit('log', `✅ Bot conectado como ${username}`);

      setTimeout(() => {
        bot.chat('/logar 250719802023');
        botEvents.emit('log', '📩 Enviou /logar');

        slotTimeout = setTimeout(() => {
          bot.setQuickBarSlot(4); // slot 5
          bot.activateItem();
          botEvents.emit('log', '🖱️ Clicou no slot 5 (right click)');

          homeTimeout = setTimeout(() => {
            bot.chat('/home farms');
            botEvents.emit('log', '🌱 Executou /home farms');
          }, 5000);

        }, 3000);
      }, 3000);
    });

    // Logs do servidor
    bot.on('chat', (u, m) => botEvents.emit('log', `<${u}> ${m}`));
    bot.on('message', (jsonMsg) => botEvents.emit('log', jsonMsg.toString()));

    // Kick / desconexão
    bot.on('kicked', (reason) => {
      botEvents.emit('log', `❌ Fui kickado: ${JSON.stringify(reason)}`);
      clearTimeout(slotTimeout);
      clearTimeout(homeTimeout);
      reconnect();
    });

    bot.on('end', () => {
      botEvents.emit('log', '🔌 Bot desconectou');
      clearTimeout(slotTimeout);
      clearTimeout(homeTimeout);
      reconnect();
    });

    bot.on('error', (err) => {
      botEvents.emit('log', `⚠️ Erro do bot: ${err}`);
    });

    // Controle externo
    botEvents.sendChat = (msg) => {
      if (bot && bot.chat) bot.chat(msg);
    };

    botEvents.kickBot = () => {
      if (bot) {
        bot.quit('Bot kickado manualmente');
        reconnect(false); // não reconecta se foi manual
      }
    };
  };

  const reconnect = (shouldReconnect = true) => {
    if (!shouldReconnect) return;
    botEvents.emit('log', '⏳ Tentando reconectar em 10s...');
    setTimeout(() => {
      username = `cachorroAlt_${Math.floor(Math.random() * 1000)}`; // novo nick
      createBot();
    }, 10000);
  };

  createBot();
  return botEvents;
}

module.exports = { startBot };
