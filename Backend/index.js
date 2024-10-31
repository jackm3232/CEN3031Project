//import { collection } from 'firebase-admin/firestore';

//import collection from "firebase-admin/firestore/lite";

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

// get list of students
// Get all students and teachers from a specific class (based on the class id)
app.get('/get-class-members/:classId', async (req, res) => {
  try {
    const { classId } = req.params;

    // Retrieve all student and teacher documents within specified class
    const studentsSnapshot = await db.collection('classes').doc(classId).collection('students').get();
    const teachersSnapshot = await db.collection('classes').doc(classId).collection('teachers').get();

    // Initialize array that will hold all class members (students and teachers)
    let allMembers = [];

    // Collect data of all students
    if (!studentsSnapshot.empty) {
      studentsSnapshot.forEach(doc => {
        allMembers.push({ id: doc.id, type: 'student', ...doc.data() });
      });
    }

    // Collect data of all teachers
    if (!teachersSnapshot.empty) {
      teachersSnapshot.forEach(doc => {
        allMembers.push({ id: doc.id, type: 'teacher', ...doc.data() });
      });
    }

    // Make sure there is at least one member in the class
    if (allMembers.length === 0) {
      return res.status(404).send('No students or teachers found for this class');
    }

    res.status(200).json(allMembers);
  } 
  catch (error) {
    console.error('Error retrieving class members:', error);
    res.status(500).send('Internal Server Error');
  }
});

/*
// Test route to check if the server is running
app.get("/", (req, res) => {

    res.send("Hello, world!");
});
*/

// Set up the server to listen on port 3500
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
