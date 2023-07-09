const express = require('express');
const router = express.Router();
const { getAllCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
