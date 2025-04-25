const { db } = require('./firebase');

async function testFirestore() {
  const docRef = db.collection('pruebas').doc('test-doc');
  await docRef.set({
    mensaje: '¡Funciona Firestore!',
    fecha: new Date()
  });

  console.log('Documento escrito correctamente.');
}

testFirestore();
