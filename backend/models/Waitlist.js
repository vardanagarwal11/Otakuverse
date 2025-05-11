import mongoose from 'mongoose';
const WaitlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now }
});
export default mongoose.model('Waitlist', WaitlistSchema);