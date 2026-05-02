const admin = require('firebase-admin');

// Initialize Firebase Admin (requires service account)
if (!admin.apps.length) {
  try {
    let credential;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      credential = admin.credential.cert(serviceAccount);
    }

    if (credential) {
      admin.initializeApp({ credential });
      console.log("Firebase Admin initialized successfully.");
    } else {
      console.warn("Firebase Admin credentials not found.");
    }
  } catch (error) {
    console.error("Firebase Admin Init Failed. Check credentials format.");
  }
}

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

module.exports = authMiddleware;
