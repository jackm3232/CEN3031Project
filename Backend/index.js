const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(require(process.env.FIREBASE_CREDENTIALS_PATH))
});

const db = admin.firestore();

app.use(express.json());
app.use(cors());

// Test route to check if the server is running
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// Set up the server to listen on port 3500
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
