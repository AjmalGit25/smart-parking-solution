const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    vehicleNumber: { type: String, required: true, uppercase: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
