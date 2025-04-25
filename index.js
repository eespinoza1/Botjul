require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { guardarReporte, guardarPregunta } = require('./controllers/botController');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
console.log('🤖 Vecino Julio Bot está corriendo...');

// Estados para los flujos
const estadoReporte = new Map();     // Flujo de reportar problemas
const esperandoPregunta = new Map(); // Flujo de hacer preguntas

// Mensaje de cierre estándar
const mensajeCierre = `
🙏 ¡Gracias por comunicarte con nosotros!

🗳️ Recuerda: *Este 25 de mayo vota por Fuerza Vecinal* para construir juntos un mejor Aragua.

Atentamente,  
*Candidato a Diputado Julio Sánchez Regalado*
`;

// Mensaje de bienvenida
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
👋🏼 ¡Hola! Soy *Vecino Julio Bot*, el canal directo con Julio Sánchez Regalado.

¿Qué quieres hacer hoy?
1️⃣ Conóceme.
2️⃣ Reportar un problema.
3️⃣ Hacer una pregunta.
4️⃣ Saber cómo votar.

Escribe el número o la opción.`, { parse_mode: 'Markdown' });
});

// Flujo general
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  // Evitar procesar /start aquí
  if (text === '/start') return;

  // -------------------- FLUJO DE PREGUNTAS --------------------
  if (esperandoPregunta.has(chatId)) {
    const pregunta = msg.text;
    const nombre = msg.from.first_name;

    await guardarPregunta(chatId, nombre, pregunta);
    bot.sendMessage(chatId, '✅ ¡Gracias por tu pregunta! Julio o su equipo te responderán pronto.');
    bot.sendMessage(chatId, mensajeCierre, { parse_mode: 'Markdown' });
    esperandoPregunta.delete(chatId);
    return;
  }

  // -------------------- FLUJO DE REPORTES --------------------
  if (msg.location) {
    if (estadoReporte.has(chatId)) {
      const estado = estadoReporte.get(chatId);
      const { latitude, longitude } = msg.location;

      await guardarReporte(chatId, estado.tipo_problema, latitude, longitude);
      bot.sendMessage(chatId, `✅ ¡Gracias! El reporte de *${estado.tipo_problema}* fue registrado.`, { parse_mode: 'Markdown' });
      bot.sendMessage(chatId, mensajeCierre, { parse_mode: 'Markdown' });
      estadoReporte.delete(chatId);
      return;
    }
  }

  // -------------------- MENÚ PRINCIPAL --------------------
  switch (text) {
    // -------------------- CONÓCEME --------------------
    case '1':
    case 'conóceme':
      bot.sendMessage(chatId, `🙋‍♂️ *Conóceme: Julio Sánchez Regalado*  

🔹 *Abogado* egresado de la *Universidad Bicentenaria de Aragua (UBA)*.  
🔹 Más de *15 años de experiencia comunitaria* resolviendo problemas reales como asfaltado de calles y recuperación de espacios públicos.  
🔹 *Promotor de la participación ciudadana* y la *justicia social*, trabajando mano a mano con los vecinos para lograr cambios concretos.

🤝 *¿Por qué seré un gran diputado?*  
✔️ Porque vengo del trabajo directo en las calles, no de promesas vacías.  
✔️ Porque creo en *recuperar las instituciones* para que sirvan al pueblo.  
✔️ Porque quiero llevar *la voz de Maracay y Aragua* a la Asamblea Nacional con propuestas claras y ejecutables.

💙 *Candidato por Fuerza Vecinal*, comprometido con construir un futuro mejor para todos.

¡Conóceme más y construyamos juntos el cambio que Aragua merece! 💪`, { parse_mode: 'Markdown' });
      bot.sendMessage(chatId, mensajeCierre, { parse_mode: 'Markdown' });
      break;

    // -------------------- REPORTAR UN PROBLEMA --------------------
    case '2':
    case 'problema':
      bot.sendMessage(chatId, '🚧 ¿Qué tipo de problema quieres reportar?\n\n🚨 Seguridad\n💡 Alumbrado\n🚰 Agua\n🕳️ Huecos\n🗑️ Basura');
      estadoReporte.set(chatId, { tipo_problema: '', latitud: '', longitud: '' });
      break;

    case 'seguridad':
    case 'alumbrado':
    case 'agua':
    case 'huecos':
    case 'basura':
      if (estadoReporte.has(chatId)) {
        const estado = estadoReporte.get(chatId);
        estado.tipo_problema = text;
        estadoReporte.set(chatId, estado);
        bot.sendMessage(chatId, `📍 Ahora, envíame la ubicación del problema de *${text}* para registrarlo.`);
      }
      break;

    // -------------------- HACER UNA PREGUNTA --------------------
    case '3':
    case 'pregunta':
      bot.sendMessage(chatId, '📩 ¡Perfecto! Escríbeme tu pregunta y la enviaré a Julio.');
      esperandoPregunta.set(chatId, true);
      break;

    // -------------------- SABER CÓMO VOTAR --------------------
    case '4':
    case 'votar':
      bot.sendPhoto(chatId, './images/vota27may.jpeg', {
        caption: '🗳️ Este 25 de mayo sigue estos pasos para votar por *Julio Sánchez Regalado* con *Fuerza Vecinal*.\n\n1️⃣ Pulsa sobre la tarjeta de *Fuerza Vecinal* (arriba y a la derecha).\n2️⃣ Luego presiona el botón *Votar*.\n\n¡Vota con FUERZA! 💪',
        parse_mode: 'Markdown'
      }).then(() => {
        bot.sendMessage(chatId, mensajeCierre, { parse_mode: 'Markdown' });
      });
      break;

    default:
      // Puedes agregar aquí un mensaje genérico si el usuario escribe algo que no entiende
      break;
  }
});
