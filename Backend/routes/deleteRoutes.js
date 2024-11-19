const express = require('express');
const router = express.Router();
const { deleteClass, deleteUser } = require('../controllers/deleteController');

router.delete('/delete-class/:classId', deleteClass);
router.delete('/delete-user/:classId/:type/:userId', deleteUser);

module.exports = router;
