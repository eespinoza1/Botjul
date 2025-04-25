const admin = require('firebase-admin');
if (process.env.FIREBASE_CONFIG) {
  // En Railway (usa variable de entorno)
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  // En local (usa archivo .json)
  serviceAccount = require('./vecinojuliobot-firebase-adminsdk-fbsvc-0e4f7eabbc.json');
}// Cambia esto por la ruta a tu archivo

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "tu-proyecto.appspot.com" // Opcional si usas Storage
});

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Opcional

module.exports = { db, bucket };
