const express = require('express');
const router = express.Router();
const dreamController = require('../controllers/dreamController');
const { protect } = require('../middleware/authMiddleware');

// Tüm rüya route'ları için authentication gerekli
router.use(protect);

// Rüya kaydetme ve kullanıcının tüm rüyalarını getirme
router.route('/')
  .post(dreamController.saveDream)
  .get(dreamController.getUserDreams);

// Tek bir rüyayı getirme, güncelleme ve silme
router.route('/:id')
  .get(dreamController.getDream)
  .put(dreamController.updateDream)
  .delete(dreamController.deleteDream);

module.exports = router; 