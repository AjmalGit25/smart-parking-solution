const router = require('express').Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  checkoutBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/checkout', protect, checkoutBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
