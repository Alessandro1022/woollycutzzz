import mongoose from 'mongoose';

// DO NOT DELETE
// const bookingSchema = new mongoose.Schema({
//   customer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   stylist: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   service: {
//     type: String,
//     enum: ['haircut', 'coloring', 'styling', 'treatment', 'other'],
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   startTime: {
//     type: String,
//     required: true
//   },
//   duration: {
//     type: Number,
//     required: true,
//     min: 40,
//     max: 480
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'completed', 'cancelled'],
//     default: 'pending'
//   },
//   notes: String
// }, {
//   timestamps: true
// });

// Static method to check if a time slot is available

const bookingSchema = new mongoose.Schema({
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
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  // stylistId: {
  //   type: String,
  //   required: true
  // },
}, {
  timestamps: true
});

bookingSchema.statics.isTimeSlotAvailable = async function (stylistId, date, startTime, duration) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const existingBookings = await this.find({
    stylist: stylistId,
    date: {
      $gte: startDate,
      $lte: endDate
    },
    status: { $ne: 'cancelled' }
  });

  // Convert booking time to minutes for comparison
  const requestedStart = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const requestedEnd = requestedStart + duration;

  return !existingBookings.some(booking => {
    const bookingStart = parseInt(booking.startTime.split(':')[0]) * 60 + parseInt(booking.startTime.split(':')[1]);
    const bookingEnd = bookingStart + booking.duration;

    return (requestedStart < bookingEnd && requestedEnd > bookingStart);
  });
};

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking; 