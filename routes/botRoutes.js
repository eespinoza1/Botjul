const { guardarReporte } = require('../controllers/botController');

// Aquí recibes el bot desde index.js
const botRoutes = (bot) => {
  // Reportar problemas
  bot.onText(/(alumbrado|seguridad|agua|huecos|basura)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const tipoProblema = match[0];

    await guardarReporte(chatId, tipoProblema);

    bot.sendMessage(chatId, `✅ ¡Gracias por reportar el problema de ${tipoProblema}! Será atendido pronto.`);
  });

  // Aquí podrías agregar otros flujos (propuestas, eventos, etc.)
};

module.exports = botRoutes;
