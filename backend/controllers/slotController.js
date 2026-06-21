const Slot = require('../models/Slot');

const getSlots = async (req, res) => {
  const slots = await Slot.find().sort({ floor: 1, slotNumber: 1 });
  res.json(slots);
};

const createSlot = async (req, res) => {
  const slot = await Slot.create(req.body);
  res.status(201).json(slot);
};

const updateSlot = async (req, res) => {
  const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!slot) return res.status(404).json({ message: 'Slot not found' });
  res.json(slot);
};

const deleteSlot = async (req, res) => {
  const slot = await Slot.findByIdAndDelete(req.params.id);
  if (!slot) return res.status(404).json({ message: 'Slot not found' });
  res.json({ message: 'Slot deleted' });
};

// Seed 20 default slots across 2 floors
const seedSlots = async (req, res) => {
  const count = await Slot.countDocuments();
  if (count > 0) return res.json({ message: 'Slots already seeded' });

  const slots = [];
  const types = ['standard', 'standard', 'standard', 'disabled', 'ev'];
  for (let floor = 1; floor <= 2; floor++) {
    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNumber: `F${floor}-${String(i).padStart(2, '0')}`,
        floor,
        type: types[i % types.length],
        status: 'available',
      });
    }
  }
  await Slot.insertMany(slots);
  res.status(201).json({ message: '20 slots seeded' });
};

module.exports = { getSlots, createSlot, updateSlot, deleteSlot, seedSlots };
