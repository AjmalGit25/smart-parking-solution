const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const getMe = (req, res) => res.json(req.user);

module.exports = { register, login, getMe };
