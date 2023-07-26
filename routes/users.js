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
router.get('/me', getMyInfo);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(http|ftp|https)?(\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])+$/),
  }),
}), updateUserAvatar);

module.exports = router;
