const admin = require('firebase-admin');
const db = admin.firestore();

// Get all students and teachers from a specific class (based on the class id)
const getClassMembersByClassId = async (req, res) => {
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
};


// Get all students or teachers from a specific class (based on the class id and specified type)
const getClassMembersByClassIdAndType = async (req, res) => {
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
};


// Get a specific student or teacher's profile (classId can be any class they are in)
const getUserInfo = async (req, res) => {
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
};

module.exports = { getClassMembersByClassId, getClassMembersByClassIdAndType, getUserInfo };
