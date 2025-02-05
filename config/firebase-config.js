const admin = require('firebase-admin');

// Initialisation de Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? 
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : 
    require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
