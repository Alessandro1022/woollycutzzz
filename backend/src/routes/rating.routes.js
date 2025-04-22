import express from 'express';
import mongoose from "mongoose";

import { auth } from '../middleware/auth.js';
import Rating from '../models/rating.model.js';
import Stylist from '../models/stylist.model.js';

const router = express.Router();

// Create new rating
router.post('/', auth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.status(201).json({ message: 'Rating created (mock)' });
    }

    const rating = new Rating({
      ...req.body,
      customer: req?.user?.id
    });
    await rating.save()

    // CALCULATING TOTAL REVIEWS
    const totalReviews = await Rating.countDocuments();

    // CAlCULATING AVERGAE RATING FROM ALL USERS
    const avgRatingResult = await Rating.aggregate([
      { $match: { stylist: new mongoose.Types.ObjectId(req.body.stylist) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);
    const averageRating = avgRatingResult[0]?.averageRating || 0;

    await Stylist.findByIdAndUpdate(
      { _id: req?.body?.stylist },
      { reviews: totalReviews, rating: averageRating.toFixed(2) }
    );


    res.status(200).json({ message: "Successfull" });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(400).json({ message: 'Error creating rating' });
  }
});

// Create new rating for guest
router.post('/guest', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.status(201).json({ message: 'Rating created (mock)' });
    }

    const rating = new Rating({
      ...req.body,
      customer: new mongoose.Types.ObjectId("0000bdea0000000000000000")
    });
    await rating.save()

    // CALCULATING TOTAL REVIEWS
    const totalReviews = await Rating.countDocuments();

    // CAlCULATING AVERGAE RATING FROM ALL USERS
    const avgRatingResult = await Rating.aggregate([
      { $match: { stylist: new mongoose.Types.ObjectId(req.body.stylist) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);
    const averageRating = avgRatingResult[0]?.averageRating || 0;

    await Stylist.findByIdAndUpdate(
      { _id: req?.body?.stylist },
      { reviews: totalReviews, rating: averageRating.toFixed(2) }
    );

    res.status(200).json({ message: "Successfull" });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(400).json({ message: 'Error creating rating' });
  }
});

export default router; 