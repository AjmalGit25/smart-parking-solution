const router = require('express').Router();
const { getSlots, createSlot, updateSlot, deleteSlot, seedSlots } = require('../controllers/slotController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getSlots);
router.post('/seed', protect, adminOnly, seedSlots);
router.post('/', protect, adminOnly, createSlot);
router.put('/:id', protect, adminOnly, updateSlot);
router.delete('/:id', protect, adminOnly, deleteSlot);

module.exports = router;
