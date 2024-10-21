const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require("cors");

// Initialize Firebase Admin SDK
const serviceAccount = require("./math-magicians-firebase-adminsdk-g8lvc-35a1e0f111.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://math-magicians-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Middleware to authenticate using Firebase ID tokens
// This will be used when tokens are sent from the frontend
async function authenticateToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send('Unauthorized');
  }
}

// Store data to Firestore (will later make this an authenticated route)
app.post('/store-data',  async (req, res) => {
  try {
    const { collection, data } = req.body;

    // Ensure required fields are present
    if (!collection || !data) {
      return res.status(400).send('Missing collection or data');
    }

    // Save the data to Firestore
    const docRef = await db.collection(collection).add(data);

    res.status(200).json({ message: 'Data stored successfully', id: docRef.id });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get data from Firestore (will later make this an authenticated route)
app.get('/get-data/:collection',  async (req, res) => {
  try {
    const { collection } = req.params;

    // Retrieve all documents from the specified collection
    const snapshot = await db.collection(collection).get();

    if (snapshot.empty) {
      return res.status(404).send('No documents found');
    }

    //for each document in collection, add doc id and all its fields to returned object
    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
