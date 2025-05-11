import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { id, email_addresses } = req.body.data;
  const email = email_addresses?.[0]?.email_address;
  try {
    await User.create({ clerkId: id, email });
    res.json({ message: 'User saved' });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'User already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;