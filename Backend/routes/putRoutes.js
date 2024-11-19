const express = require('express');
const router = express.Router();
const { updateUserInfo, addUserToClass, removeUserFromClass } = require('../controllers/putController');

router.put('/update-user/:classId/:type/:userId', updateUserInfo);
router.put('/add-to-class/:newClassId/:existingClassId/:type/:userId', addUserToClass);
router.put('/remove-from-class/:classId/:type/:userId', removeUserFromClass);

module.exports = router;
