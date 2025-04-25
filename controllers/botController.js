const { db } = require('../firebase');


// Guardar reporte con ubicación
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

  } catch (error) {
    console.error('Error guardando el reporte:', error);
  }
};



// Guardar pregunta del usuario
const guardarPregunta = async (chatId, nombre, pregunta) => {
  try {
    await db.collection('preguntas').add({
      usuarioId: chatId,
      nombre: nombre,
      pregunta: pregunta,
      fecha_pregunta: new Date()
    });
    console.log(`Pregunta guardada de ${nombre} (${chatId}): ${pregunta}`);
  } catch (error) {
    console.error('Error guardando la pregunta:', error);
  }
};

module.exports = { guardarReporte, guardarPregunta };




