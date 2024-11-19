const admin = require('firebase-admin');
const db = admin.firestore();

// Update the data of an already existing student or teacher for each class they are in
const updateUserInfo = async (req, res) => {
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
};


// Add a student or teacher to another class (give class to be added to and one they are already in)
const addUserToClass = async (req, res) => {
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
};


// Remove a student or teacher from a specific class, update their classIds lists in other classes
const removeUserFromClass = async (req, res) => {
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
};

module.exports = { updateUserInfo, addUserToClass, removeUserFromClass };
