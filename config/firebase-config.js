const admin = require('firebase-admin');

// Initialisation de Firebase Admin
// if (!process.env.FIREBASE_PROJECT_ID || 
//     !process.env.FIREBASE_PRIVATE_KEY || 
//     !process.env.FIREBASE_CLIENT_EMAIL) {
//     throw new Error('Les variables d\'environnement Firebase ne sont pas configurées');
// }

// const serviceAccount = {
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL
// };

var serviceAccount = require("./kintacoswiikko-firebase-adminsdk-fbsvc-49215b0150.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };


