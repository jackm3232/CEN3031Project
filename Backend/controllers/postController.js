const admin = require('firebase-admin');
const db = admin.firestore();

// Create a new student or teacher and add them to the specified class (class id, type, and user id required)
const createNewUser = async (req, res) => {
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
};

module.exports = { createNewUser };
