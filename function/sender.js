const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

async function sendNotification(token, title, message, largeIconUrl) {
  const payload = {
    notification: {
      title,
      body: message,
      image: largeIconUrl
    },
    token,
  };
  
  try {
    const response = await admin.messaging().send(payload);
    console.log(`✅ Sent to ${token}:`, response);
  } catch (error) {
    console.error(`❌ Error sending to ${token}:`, error);
  }
}

module.exports = { sendNotification };