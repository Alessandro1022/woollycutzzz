require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

const stylists = [
  {
    id: '1',
    name: 'Woolley Cutzzz',
    specialty: 'Herrklippning & Skäggvård',
    experience: 5,
    image: '/images/stylist1.jpg',
    rating: 4.9,
    specialties: ['Herrklippning', 'Skäggvård'],
    bio: 'Professionell frisör med fokus på herrklippning och skäggvård. Erbjuder en avslappnad och professionell upplevelse i Kristinedal träningcenter.',
    availability: {
      days: ['onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'],
      hours: {
        start: '11:00',
        end: '23:00'
      }
    },
    services: [
      {
        id: '1',
        name: 'Herrklippning',
        price: 150,
        duration: '30 min',
        description: 'Professionell herrklippning med modern finish'
      },
      {
        id: '2',
        name: 'Herrklippning med skägg',
        price: 200,
        duration: '45 min',
        description: 'Herrklippning inklusive skäggtrimning och styling'
      }
    ],
    location: 'Kristinedal träningcenter'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing stylists
    await User.deleteMany({ role: 'stylist' });
    console.log('Cleared existing stylists');

    // Insert new stylists
    await User.insertMany(stylists);
    console.log('Added stylists to database');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 