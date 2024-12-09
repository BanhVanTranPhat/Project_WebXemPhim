import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: String }],
  releaseDate: { type: Date },
  description: { type: String },
  posterUrl: { type: String },
  isPremium: { type: Boolean, default: false },
  duration: { type: Number },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  averageRating: { type: Number, default: 0 },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Movie', userSchema);
