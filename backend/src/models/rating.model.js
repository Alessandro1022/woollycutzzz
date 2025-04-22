import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: mongoose.Schema.Types.Double,
    require: true,
  }
}, {
  timestamps: true
});

export const Rating = mongoose.model('Rating', ratingSchema);
export default Rating; 