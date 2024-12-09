import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
});

export default mongoose.model('User', userSchema);
