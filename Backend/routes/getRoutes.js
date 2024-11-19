const express = require('express');
const router = express.Router();
const { getClassMembersByClassId, getClassMembersByClassIdAndType, getUserInfo } = require('../controllers/getController');

router.get('/get-class-members/:classId', getClassMembersByClassId);
router.get('/get-class-members/:classId/:type', getClassMembersByClassIdAndType);
router.get('/get-user-info/:classId/:type/:userId', getUserInfo);

module.exports = router;
