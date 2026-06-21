const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

const RATE_PER_HOUR = 50; // currency units per hour

const createBooking = async (req, res) => {
  const { slotId, vehicleNumber } = req.body;

  const slot = await Slot.findById(slotId);
  if (!slot) return res.status(404).json({ message: 'Slot not found' });
  if (slot.status !== 'available')
    return res.status(400).json({ message: 'Slot is not available' });

  slot.status = 'occupied';
  await slot.save();

  const booking = await Booking.create({
    user: req.user._id,
    slot: slotId,
    vehicleNumber,
    startTime: new Date(),
  });

  res.status(201).json(await booking.populate('slot'));
};

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('slot')
    .sort({ createdAt: -1 });
  res.json(bookings);
};

const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('slot')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(bookings);
};

const checkoutBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('slot');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.status !== 'active')
    return res.status(400).json({ message: 'Booking already closed' });

  const endTime = new Date();
  const hours = Math.max(
    1,
    Math.ceil((endTime - booking.startTime) / (1000 * 60 * 60))
  );

  booking.endTime = endTime;
  booking.status = 'completed';
  booking.totalAmount = hours * RATE_PER_HOUR;
  await booking.save();

  await Slot.findByIdAndUpdate(booking.slot._id, { status: 'available' });

  res.json(booking);
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  if (booking.status !== 'active')
    return res.status(400).json({ message: 'Cannot cancel this booking' });

  booking.status = 'cancelled';
  await booking.save();
  await Slot.findByIdAndUpdate(booking.slot, { status: 'available' });

  res.json({ message: 'Booking cancelled' });
};

module.exports = { createBooking, getMyBookings, getAllBookings, checkoutBooking, cancelBooking };
