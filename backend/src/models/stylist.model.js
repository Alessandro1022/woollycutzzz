import mongoose from 'mongoose';

const stylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  specialties: {
    type: [String],
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // availability: [{
  //   day: {
  //     type: String,
  //     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  //   },
  //   slots: [{
  //     start: String,
  //     end: String
  //   }]
  // }],
  services: [{
    name: {
      type: String,
      trime: true
    },
    price: {
      type: Number,
    },
    duration: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  availability: {
    days: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    hours: {
      start: String,
      end: String
    }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
stylistSchema.index({
  name: 'text',
  specialties: 'text',
  bio: 'text'
});

export const Stylist = mongoose.model('Stylist', stylistSchema);
export default Stylist; 