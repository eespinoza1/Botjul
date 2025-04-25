const { db } = require('../firebase');
const { enviarCorreo } = require('../mailer');

// Guardar pregunta y enviar correo
const guardarPregunta = async (chatId, nombre, pregunta) => {
  try {
    await db.collection('preguntas').add({
      usuarioId: chatId,
      nombre: nombre,
      pregunta: pregunta,
      fecha_pregunta: new Date()
    });
    console.log(`Pregunta guardada de ${nombre} (${chatId}): ${pregunta}`);

    // Enviar correo
    await enviarCorreo(
      'Nueva pregunta recibida',
      `De: ${nombre} (ID: ${chatId})\nPregunta: ${pregunta}`
    );

  } catch (error) {
    console.error('Error guardando la pregunta:', error);
  }
};

// Guardar reporte y enviar correo
const guardarReporte = async (chatId, tipoProblema, latitud, longitud) => {
  try {
    await db.collection('reportes').add({
      usuarioId: chatId,
      tipo_problema: tipoProblema,
      latitud: latitud,
      longitud: longitud,
      estado: 'pendiente',
      fecha_reporte: new Date()
    });
    console.log(`Reporte guardado: ${tipoProblema} (${latitud}, ${longitud})`);

    // Enviar correo
    await enviarCorreo(
      'Nuevo reporte de problema',
      `De: Usuario ID ${chatId}\nProblema: ${tipoProblema}\nUbicación: (${latitud}, ${longitud})`
    );

  } catch (error) {
    console.error('Error guardando el reporte:', error);
  }
};

module.exports = { guardarPregunta, guardarReporte };
