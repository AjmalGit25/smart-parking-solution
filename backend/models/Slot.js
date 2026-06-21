const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    slotNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    type: { type: String, enum: ['standard', 'disabled', 'ev'], default: 'standard' },
    status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
