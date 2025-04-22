import express from 'express';
import { z } from 'zod';
import User from '../models/user.model.js';
import { auth, authorize } from '../middleware/auth.js';
import Stylist from '../models/stylist.model.js';
import { mockStylists } from '../data/mockData.js';

const router = express.Router();

// Validation schemas
const updateStylistSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  }).optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.array(z.number()).length(2)
  }).optional(),
  profileImage: z.string().optional()
});

// Get all stylists
router.get('/', async (req, res) => {
  try {
    // In development, always return mock data
    if (process.env.NODE_ENV === 'development') {
      return res.json(mockStylists);
    }

    const stylists = await Stylist.find({ isActive: true });
    res.json(stylists);
  } catch (error) {
    console.error('Error fetching stylists:', error);
    // If database error, return mock data in development
    if (process.env.NODE_ENV === 'development') {
      return res.json(mockStylists);
    }
    res.status(500).json({ message: 'Error fetching stylists' });
  }
});

// Get stylist by ID
router.get('/:id', async (req, res) => {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockStylist = mockStylists.find(s => s._id === req.params.id);
      if (mockStylist) {
        return res.json(mockStylist);
      }
      return res.status(404).json({ message: 'Stylist not found' });
    }

    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) {
      return res.status(404).json({ message: 'Stylist not found' });
    }
    res.json(stylist);
  } catch (error) {
    console.error('Error fetching stylist:', error);
    res.status(500).json({ message: 'Error fetching stylist' });
  }
});

// Create new stylist
router.post('/', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.status(201).json({ message: 'Stylist created (mock)' });
    }

    const stylist = new Stylist(req.body);
    await stylist.save();
    res.status(201).json(stylist);
  } catch (error) {
    console.error('Error creating stylist:', error);
    res.status(400).json({ message: 'Error creating stylist', error: error.message });
  }
});

// Update stylist
router.put('/:id', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({ message: 'Stylist updated (mock)' });
    }

    const stylist = await Stylist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stylist) {
      return res.status(404).json({ message: 'Stylist not found' });
    }
    res.json(stylist);
  } catch (error) {
    console.error('Error updating stylist:', error);
    res.status(400).json({ message: 'Error updating stylist', error: error.message });
  }
});

// Delete stylist (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({ message: 'Stylist deleted (mock)' });
    }

    const stylist = await Stylist.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!stylist) {
      return res.status(404).json({ message: 'Stylist not found' });
    }
    res.json({ message: 'Stylist deleted successfully' });
  } catch (error) {
    console.error('Error deleting stylist:', error);
    res.status(500).json({ message: 'Error deleting stylist' });
  }
});

// Update stylist profile
router.patch('/:id', auth, authorize('admin', 'stylist'), async (req, res) => {
  try {
    const validatedData = updateStylistSchema.parse(req.body);

    // Check if user has permission to update this profile
    if (req.user.role === 'stylist' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this profile'
      });
    }

    const stylist = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'stylist' },
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!stylist) {
      return res.status(404).json({
        status: 'error',
        message: 'Stylist not found'
      });
    }

    res.json({
      status: 'success',
      data: { stylist }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Error updating stylist profile'
    });
  }
});

// Get stylists near location
router.get('/near/:postalCode', async (req, res) => {
  try {
    const { distance = 10000 } = req.query; // Default 10km radius
    const postalCode = req.params.postalCode;

    // Get coordinates for postal code (you would typically use a geocoding service)
    // This is a placeholder - you should implement proper geocoding
    const coordinates = await getCoordinatesFromPostalCode(postalCode);

    const stylists = await User.find({
      role: 'stylist',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: parseInt(distance)
        }
      }
    })
      .select('-password')
      .sort({ name: 1 });

    res.json({
      status: 'success',
      data: { stylists }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching nearby stylists'
    });
  }
});

// Helper function to get coordinates from postal code
async function getCoordinatesFromPostalCode(postalCode) {
  // This is a placeholder - implement proper geocoding
  // You would typically use a service like Google Maps Geocoding API
  return [11.9746, 57.7089]; // Example coordinates for Gothenburg
}

export default router; 