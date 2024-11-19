const express = require('express');
const router = express.Router();
const { createNewUser } = require('../controllers/postController');

router.post('/create-new-user/:classId/:type/:userId', createNewUser);

module.exports = router;
