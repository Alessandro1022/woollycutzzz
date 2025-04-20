export const mockStylists = [
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

export const mockBookings = [
  {
    _id: '1',
    customer: '1',
    stylist: '1',
    service: 'haircut',
    date: new Date('2024-03-25'),
    startTime: '10:00',
    duration: 60,
    price: 500,
    status: 'confirmed'
  },
  {
    _id: '2',
    customer: '1',
    stylist: '2',
    service: 'coloring',
    date: new Date('2024-03-30'),
    startTime: '14:00',
    duration: 120,
    price: 1200,
    status: 'pending'
  }
];

export const mockStylists2 = [
  {
    _id: '1',
    customer: '1',
    stylist: '1',
    service: 'haircut',
    date: new Date('2024-03-25'),
    startTime: '10:00',
    duration: 60,
    price: 500,
    status: 'confirmed'
  },
  {
    _id: '2',
    customer: '1',
    stylist: '2',
    service: 'coloring',
    date: new Date('2024-03-30'),
    startTime: '14:00',
    duration: 120,
    price: 1200,
    status: 'pending'
  }
];

export const mockUsers = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    phone: '+46 70 123 45 67'
  },
  {
    _id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    phone: '+46 70 987 65 43'
  }
]; 