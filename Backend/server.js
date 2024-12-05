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

app.use(bodyParser.json());
app.use(cors());

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

// Get all students or teachers from a specific class (based on the class id and specified type)
app.get('/get-class-members/:classId/:type', async (req, res) => {
  try {
    const { classId, type } = req.params;

    // Ensure type is either 'students' or 'teachers'
    if (type !== 'students' && type !== 'teachers') {
      return res.status(400).send('Invalid type. Must be "students" or "teachers".');
    }

    // Retrieve all student or teacher documents within the specified class
    const snapshot = await db.collection('classes').doc(classId).collection(type).get();

    if (snapshot.empty) {
      return res.status(404).send(`No ${type} found for this class`);
    }

    // Collect the info (specific data fields) for each student or teacher within the class
    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } 
  catch (error) {
    console.error('Error retrieving class members:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific student or teacher's profile (classId can be any class they are in)
app.get('/get-user-info/:classId/:type/:userId', async (req, res) => {
  try {
    const { classId, type, userId } = req.params;

    // Access the student or teacher's data within the specified class
    const userDoc = await db.collection('classes').doc(classId).collection(type).doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    // Send the student or teacher's info back to the frontend
    res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } 
  catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new student or teacher and add them to the specified class (class id, type, and user id required)
app.post('/create-new-user/:classId/:type/:userId', async (req, res) => {
  try {
    const { classId, type, userId } = req.params;
    const data = req.body;

    // Ensure type is either 'students' or 'teachers'
    if (type !== 'students' && type !== 'teachers') {
      return res.status(400).send('Invalid type. Must be "students" or "teachers".');
    }

    // Ensure data is present in the request
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).send('Missing data. Make sure user attributes are present.');
    }

    // Create the classId data field and add the specified class id to the list of classes the student or teacher is associated with
    data.classIds = [];
    data.classIds.push(classId);

    // Add student or teacher to the corresponding sub-collection within the specified class
    await db.collection('classes').doc(classId).collection(type).doc(userId).set(data);

    res.status(200).json({ message: `${type.slice(0, -1)} added successfully`, id: userId });
  } 
  catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update the data of an already existing student or teacher for each class they are in
app.put('/update-user/:classId/:type/:userId', async (req, res) => {
  try {
    const { classId, type, userId } = req.params;
    const updatedData = req.body;

    // Ensure type is either 'students' or 'teachers'
    if (type !== 'students' && type !== 'teachers') {
      return res.status(400).send('Invalid type. Must be "students" or "teachers".');
    }

    // Ensure there is data in the request body
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).send('No data provided for update.');
    }

    // Retrieve the student or teacher document within the specified class
    const userDoc = await db.collection('classes').doc(classId).collection(type).doc(userId).get();

    // Make sure the student or teacher document exists
    if (!userDoc.exists) {
      return res.status(404).send(`${type.slice(0, -1)} not found in the specified class`);
    }

    // Retrieve the student or teacher's current data, including the classId list
    const userData = userDoc.data();
    const classIds = userData.classIds || [];

    // Update the student or teacher's data without changing the classId list
    const newUserData = {
      ...updatedData,
      classIds: classIds
    };

    // Loop through each classId and update the student or teacher's data in each class they are in
    for (const existingClassId of classIds) {
      const classRef = db.collection('classes').doc(existingClassId).collection(type).doc(userId);
      
      try {
        await classRef.update(newUserData);
      } 
      catch (error) {
        console.error(`Error updating data in classId ${existingClassId}:`, error);
      }
    }

    res.status(200).json({ message: `${type.slice(0, -1)} updated in all associated classes successfully` });
  } 
  catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a student or teacher to another class (give class to be added to and one they are already in)
app.put('/add-to-class/:newClassId/:existingClassId/:type/:userId', async (req, res) => {
  try {
    const { newClassId, existingClassId, type, userId } = req.params;

    // Ensure type is either 'students' or 'teachers'
    if (type !== 'students' && type !== 'teachers') {
      return res.status(400).send('Invalid type. Must be "students" or "teachers".');
    }

    // Retrieve the student or teacher's document in the class they are already in
    const userDoc = await db.collection('classes').doc(existingClassId).collection(type).doc(userId).get();

    // Make sure the student or teacher exists in the provided existing class
    if (!userDoc.exists) {
      return res.status(404).send(`${type.slice(0, -1)} not found in the specified class`);
    }

    // Get the student or teacher's current classId list
    const userData = userDoc.data();
    const existingClassIds = userData.classIds || [];

    // Add the student or teacher to the new class if they are not already in it
    const newClassRef = db.collection('classes').doc(newClassId).collection(type).doc(userId);
    const newClassUserDoc = await newClassRef.get();

    if (!newClassUserDoc.exists) {
      // Initialize student or teacher in the new class with classId list that includes the newClassId
      await newClassRef.set({
        ...userData,
        classIds: [...existingClassIds, newClassId]
      });
    } 
    else {
      // Student or teacher already exists in the new class, so just update their classId list
      await newClassRef.update({
        classIds: admin.firestore.FieldValue.arrayUnion(newClassId)
      });
    }

    // Update the classId array across all classes the user is already in
    for (const existingClassId of existingClassIds) {
      const classRef = db.collection('classes').doc(existingClassId).collection(type).doc(userId);
      await classRef.update({
        classIds: admin.firestore.FieldValue.arrayUnion(newClassId)
      });
    }

    res.status(200).json({ message: `${type.slice(0, -1)} updated and added to new class successfully` });
  } 
  catch (error) {
    console.error('Error adding user to new class:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Remove a student or teacher from a specific class, update their classIds lists in other classes
app.put('/remove-from-class/:classId/:type/:userId', async (req, res) => {
  try {
    const { classId, type, userId } = req.params;

    // Ensure type is either 'students' or 'teachers'
    if (type !== 'students' && type !== 'teachers') {
      return res.status(400).send('Invalid type. Must be "students" or "teachers".');
    }

    // Get the student/teacher's document in the class they will be removed from
    const userRef = db.collection('classes').doc(classId).collection(type).doc(userId);
    const userDoc = await userRef.get();

    // Make sure the user exists in the specified class
    if (!userDoc.exists) {
      return res.status(404).send(`${type.slice(0, -1)} not found in the specified class`);
    }

    // Get the student/teacher's data to access the classIds list
    const userData = userDoc.data();
    const classIds = userData.classIds || [];

    // Remove the classId in which the student/teacher is getting removed from their classIds lists in other classes
    const updatePromises = [];
    for (const otherClassId of classIds) {
      if (otherClassId !== classId) {
        const otherClassRef = db.collection('classes').doc(otherClassId).collection(type).doc(userId);

        updatePromises.push(
          otherClassRef.update({
            classIds: admin.firestore.FieldValue.arrayRemove(classId)
          })
        );
      }
    }

    // Wait for all classIds list updates to finish before removing the student/teacher from the specified class
    await Promise.all(updatePromises);

    // Delete the student/teacher from the specified class
    await userRef.delete();

    res.status(200).json({ message: `${type.slice(0, -1)} removed from class ${classId} and classIds updated in other classes` });
  } 
  catch (error) {
    console.error('Error removing user from class:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a specific class (does not delete the class members from other classes they are in though)
app.delete('/delete-class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;

    // Retrieve all students and teachers in the class to be deleted
    const studentsSnapshot = await db.collection('classes').doc(classId).collection('students').get();
    const teachersSnapshot = await db.collection('classes').doc(classId).collection('teachers').get();

    // Get the references for all student and teacher documents in the class
    const studentRefs = studentsSnapshot.docs.map(doc => doc.ref);
    const teacherRefs = teachersSnapshot.docs.map(doc => doc.ref);

    // Create array of promises
    // This will handle to handle removing the deleted classId from the classId lists of each user in other classes
    const updatePromises = [];

    for (const userRef of [...studentRefs, ...teacherRefs]) {
      // Retrieve the student/teacher data to access their classId list
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (userData && userData.classIds) {
        // Get a list of the other classes the student/teacher is in (excluding the class to be deleted)
        const otherClasses = userData.classIds.filter(id => id !== classId);
        
        for (const otherClassId of otherClasses) {
          const type = userRef.path.includes('students') ? 'students' : 'teachers';
          const otherClassRef = db.collection('classes').doc(otherClassId).collection(type).doc(userRef.id);

          // Remove the deleted classId from the student or teacher's classId list in the other class
          updatePromises.push(
            otherClassRef.update({
              classIds: admin.firestore.FieldValue.arrayRemove(classId)
            })
          );
        }
      }
    }

    // Wait for all classId lists of the student/teacher objects in other classes to be updated
    await Promise.all(updatePromises);

    // Delete all students and teachers in the specified class to be deleted
    const deletionPromises = [...studentRefs.map(ref => ref.delete()), ...teacherRefs.map(ref => ref.delete())];
    await Promise.all(deletionPromises);

    // Delete the class document itself
    await db.collection('classes').doc(classId).delete();

    res.status(200).json({ message: 'Class and all associated students and teachers deleted successfully' });
  } 
  catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete student or teacher from all the classes they are in (give one of the user's classIds in url)
app.delete('/delete-user/:classId/:type/:userId', async (req, res) => {
  try {
    const { classId, type, userId } = req.params;

    // Ensure type is either 'students' or 'teachers'
    if (type !== 'students' && type !== 'teachers') {
      return res.status(400).send('Invalid type. Must be "students" or "teachers".');
    }

    // Locate the student or teacher document within the specified class
    const userDocSnapshot = await db.collection('classes').doc(classId).collection(type).doc(userId).get();

    // Make sure the student or teacher exists in the specified class
    if (!userDocSnapshot.exists) {
      return res.status(404).send(`${type.slice(0, -1)} not found in the specified class`);
    }

    // Retrieve the student or teacher's classId array from the document data
    const userData = userDocSnapshot.data();
    const classIds = userData.classIds || [];

    // Loop through each classId and delete the student or teacher from each class they are in
    for (const classId of classIds) {
      await db.collection('classes').doc(classId).collection(type).doc(userId).delete();
    }

    res.status(200).json({ message: `${type.slice(0, -1)} deleted from all associated classes successfully` });
  } 
  catch (error) {
    console.error('Error deleting user from all classes:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});