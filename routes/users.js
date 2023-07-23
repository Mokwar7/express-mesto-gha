const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  getMyInfo,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/me', getMyInfo);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
