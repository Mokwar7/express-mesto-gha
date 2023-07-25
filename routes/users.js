const express = require('express');

const { celebrate, Joi } = require('celebrate');

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
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(http|ftp|https)?(\:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])+$/),
  })
}), updateUserAvatar);

module.exports = router;
