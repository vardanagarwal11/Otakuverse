import express from 'express';
import Waitlist from '../models/Waitlist.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    await Waitlist.create({ email });
    res.json({ message: 'Added to waitlist!' });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already joined' });
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;