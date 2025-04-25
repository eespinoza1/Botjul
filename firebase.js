const admin = require('firebase-admin');
let serviceAccount;

if (process.env.FIREBASE_CONFIG) {
  // Railway: carga el JSON desde la variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  // Local: carga el archivo JSON
  serviceAccount = require('./vecinojuliobot-firebase-adminsdk-fbsvc-0e4f7eabbc.json'); // Asegúrate que esté en esta ruta
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = { db };
