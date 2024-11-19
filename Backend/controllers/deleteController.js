const admin = require('firebase-admin');
const db = admin.firestore();

// Delete a specific class (does not delete the class members from other classes they are in though)
const deleteClass = async (req, res) => {
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
};


// Delete student or teacher from all the classes they are in (give one of the user's classIds in url)
const deleteUser = async (req, res) => {
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
};

module.exports = { deleteClass, deleteUser };
