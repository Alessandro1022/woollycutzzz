import express from 'express';
import mongoose from "mongoose";

import { auth } from '../middleware/auth.js';
import Booking from '../models/booking.model.js';
import { mockBookings } from '../data/mockData.js';

const router = express.Router();

// Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_MODE === 'true') {
      return res.json(mockBookings);
    }

    if (req.user.role === "admin") {
      const bookings = await Booking.find({})
      // .populate('customer', 'name email')
      // .populate('stylist', 'name email');
      res.json(bookings);
    } else {
      const bookings = await Booking.find({ customer: new mongoose.Types.ObjectId(req.user._id) })
      // .populate('customer', 'name email')
      // .populate('stylist', 'name email');
      res.json(bookings);
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    if (process.env.NODE_ENV === 'development') {
      return res.json(mockBookings);
    }
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const mockBooking = mockBookings.find(b => b._id === req.params.id);
      if (mockBooking) {
        return res.json(mockBooking);
      }
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('stylist', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.status(201).json({ message: 'Booking created (mock)' });
    }
    const booking = new Booking({
      ...req.body,
      customer: req?.user?._id
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: 'Error creating booking' });
  }
});

// Create new booking for guest
router.post('/guest', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.status(201).json({ message: 'Booking created (mock)' });
    }
    const booking = new Booking({
      ...req.body,
      customer: new mongoose.Types.ObjectId("0000bdea0000000000000000")
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: 'Error creating booking' });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({ message: 'Booking updated (mock)' });
    }
    if (req.user.role === "admin") {
      const booking = await Booking.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        req.body,
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } else {
      const booking = await Booking.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id), customer: req.user._id },
        req.body,
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    }
  } catch (error) {
    console.log("error", error);

    console.error('Error updating booking:', error);
    res.status(400).json({ message: 'Error updating booking' });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({ message: 'Booking cancelled (mock)' });
    }

    if (req.user.role === "admin") {
      const booking = await Booking.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { status: 'Avbokad' },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ message: 'Booking cancelled successfully' });
    } else {
      const booking = await Booking.findOneAndUpdate(
        { _id: req.params.id, customer: req.user._id },
        { status: 'Avbokad' },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ message: 'Booking cancelled successfully' });
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// get available time slotes
router.post('/bookedSlots', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_MODE === 'true') {
      return res.json(mockBookings);
    }

    const allbookings = await Booking.find({ stylist: req.body.stylistId, date: req.body.date });
    const bookedTimeSlots = [...new Set(allbookings.map(b => b.time))].sort();
    return res.status(200).json(bookedTimeSlots || []);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

export default router; 