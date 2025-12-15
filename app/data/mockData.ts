// Mock data for Indian Wedding & Event Studio
// Easy to replace with API calls later

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  deliverables: string[];
  preview: string;
  duration: string;
  popular?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  eventType: string;
  eventName: string;
  date: string;
  venue: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  assignedTeam?: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer' | 'team';
  avatar?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  photo: string;
  experience: string;
  bio: string;
  instagram?: string;
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  category: string;
  eventType: string;
}

// Dummy Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@royalweddings.com',
    phone: '+91 98765 43210',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: '2024-01-01',
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 98765 12345',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2024-06-15',
  },
  {
    id: 'user-3',
    name: 'Rahul Verma',
    email: 'rahul@email.com',
    phone: '+91 87654 32109',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2024-07-20',
  },
  {
    id: 'team-1',
    name: 'Arjun Kapoor',
    email: 'arjun@royalweddings.com',
    phone: '+91 99887 76655',
    role: 'team',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    createdAt: '2023-03-10',
  },
];

// Dummy credentials for login
export const credentials = {
  admin: { email: 'admin@royalweddings.com', password: 'admin123' },
  customer: { email: 'priya@email.com', password: 'customer123' },
  team: { email: 'arjun@royalweddings.com', password: 'team123' },
};

// Dummy Packages
export const packages: Package[] = [
  {
    id: 'pkg-1',
    name: 'Royal Heritage',
    price: 500000,
    description: 'Our flagship package for grand celebrations. Complete coverage of all wedding ceremonies with cinematic storytelling.',
    deliverables: [
      '3 Days Full Coverage',
      'Cinematic Wedding Film (15-20 mins)',
      '500+ Edited Photos',
      'Same Day Edit',
      'Drone Coverage',
      'Photo Album (60 pages)',
      '2 Photographers + 2 Videographers',
    ],
    preview: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    duration: '3 Days',
    popular: true,
  },
  {
    id: 'pkg-2',
    name: 'Golden Moments',
    price: 300000,
    description: 'Perfect for intimate celebrations with premium quality coverage and deliverables.',
    deliverables: [
      '2 Days Full Coverage',
      'Wedding Film (10-12 mins)',
      '350+ Edited Photos',
      'Highlight Reel',
      'Photo Album (40 pages)',
      '1 Photographer + 1 Videographer',
    ],
    preview: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    duration: '2 Days',
  },
  {
    id: 'pkg-3',
    name: 'Silver Celebrations',
    price: 150000,
    description: 'Essential coverage for your special day with quality assured deliverables.',
    deliverables: [
      '1 Day Coverage',
      'Wedding Highlights (5-7 mins)',
      '200+ Edited Photos',
      'Digital Album',
      '1 Photographer + 1 Videographer',
    ],
    preview: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    duration: '1 Day',
  },
  {
    id: 'pkg-4',
    name: 'Pre-Wedding Special',
    price: 75000,
    description: 'Capture your love story before the big day with stunning pre-wedding shoots.',
    deliverables: [
      'Full Day Shoot',
      'Pre-Wedding Film (3-5 mins)',
      '100+ Edited Photos',
      '2 Outfit Changes',
      'Location Scouting',
    ],
    preview: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    duration: '1 Day',
  },
  {
    id: 'pkg-5',
    name: 'Engagement Bliss',
    price: 50000,
    description: 'Document your engagement ceremony with elegance and style.',
    deliverables: [
      'Half Day Coverage',
      'Engagement Highlights (3-4 mins)',
      '150+ Edited Photos',
      'Digital Gallery',
    ],
    preview: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
    duration: 'Half Day',
  },
];

// Dummy Bookings
export const bookings: Booking[] = [
  {
    id: 'book-1',
    userId: 'user-2',
    packageId: 'pkg-1',
    eventType: 'Wedding',
    eventName: 'Priya & Vikram Wedding',
    date: '2024-12-15',
    venue: 'Taj Palace, New Delhi',
    status: 'approved',
    totalAmount: 500000,
    paidAmount: 250000,
    notes: 'Traditional North Indian wedding with Sangeet, Mehndi, and Reception',
    assignedTeam: ['team-1'],
    createdAt: '2024-08-01',
  },
  {
    id: 'book-2',
    userId: 'user-3',
    packageId: 'pkg-2',
    eventType: 'Wedding',
    eventName: 'Rahul & Ananya Wedding',
    date: '2024-11-20',
    venue: 'ITC Grand Bharat, Gurugram',
    status: 'in-progress',
    totalAmount: 300000,
    paidAmount: 300000,
    assignedTeam: ['team-1'],
    createdAt: '2024-07-15',
  },
  {
    id: 'book-3',
    userId: 'user-2',
    packageId: 'pkg-4',
    eventType: 'Pre-Wedding',
    eventName: 'Priya & Vikram Pre-Wedding',
    date: '2024-10-05',
    venue: 'Jaipur City Palace',
    status: 'completed',
    totalAmount: 75000,
    paidAmount: 75000,
    createdAt: '2024-08-20',
  },
  {
    id: 'book-4',
    userId: 'user-3',
    packageId: 'pkg-5',
    eventType: 'Engagement',
    eventName: 'Engagement Ceremony',
    date: '2024-12-01',
    venue: 'The Leela Palace, Mumbai',
    status: 'pending',
    totalAmount: 50000,
    paidAmount: 0,
    createdAt: '2024-09-10',
  },
];

// Dummy Team Members
export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Arjun Kapoor',
    role: 'Lead Photographer',
    specialization: 'Candid Photography',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    experience: '12 Years',
    bio: 'Award-winning photographer specializing in capturing authentic emotions and candid moments.',
    instagram: '@arjunkapoor_photography',
  },
  {
    id: 'team-2',
    name: 'Meera Reddy',
    role: 'Senior Videographer',
    specialization: 'Cinematic Films',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    experience: '8 Years',
    bio: 'Cinematic storyteller who transforms wedding moments into timeless films.',
    instagram: '@meerareddy_films',
  },
  {
    id: 'team-3',
    name: 'Vikram Singh',
    role: 'Drone Specialist',
    specialization: 'Aerial Photography',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    experience: '6 Years',
    bio: 'Expert in aerial cinematography, capturing breathtaking views of your celebrations.',
    instagram: '@vikram_aerials',
  },
  {
    id: 'team-4',
    name: 'Anita Desai',
    role: 'Photo Editor',
    specialization: 'Color Grading',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    experience: '10 Years',
    bio: 'Master of post-production, bringing out the magic in every frame.',
    instagram: '@anita_edits',
  },
  {
    id: 'team-5',
    name: 'Rajesh Nair',
    role: 'Creative Director',
    specialization: 'Art Direction',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    experience: '15 Years',
    bio: 'Visionary creative director who orchestrates the perfect visual narrative.',
    instagram: '@rajesh_creative',
  },
];

// Dummy Gallery
export const gallery: GalleryItem[] = [
  {
    id: 'gal-1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    title: 'Royal Mandap Ceremony',
    category: 'Ceremony',
    eventType: 'Wedding',
  },
  {
    id: 'gal-2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
    title: 'Bride\'s Entry',
    category: 'Bridal',
    eventType: 'Wedding',
  },
  {
    id: 'gal-3',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200',
    title: 'Mehndi Celebration',
    category: 'Mehndi',
    eventType: 'Pre-Wedding',
  },
  {
    id: 'gal-4',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200',
    title: 'Couple Portrait',
    category: 'Portraits',
    eventType: 'Pre-Wedding',
  },
  {
    id: 'gal-5',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
    title: 'Ring Ceremony',
    category: 'Engagement',
    eventType: 'Engagement',
  },
  {
    id: 'gal-6',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200',
    title: 'Sangeet Night',
    category: 'Sangeet',
    eventType: 'Pre-Wedding',
  },
  {
    id: 'gal-7',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200',
    title: 'Baraat Procession',
    category: 'Ceremony',
    eventType: 'Wedding',
  },
  {
    id: 'gal-8',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1200',
    title: 'Reception Glamour',
    category: 'Reception',
    eventType: 'Wedding',
  },
  {
    id: 'gal-9',
    type: 'video',
    url: 'https://player.vimeo.com/video/123456789',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    title: 'Wedding Highlight Film',
    category: 'Films',
    eventType: 'Wedding',
  },
  {
    id: 'gal-10',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200',
    title: 'Traditional Decor',
    category: 'Decor',
    eventType: 'Wedding',
  },
  {
    id: 'gal-11',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200',
    title: 'Floral Arrangements',
    category: 'Decor',
    eventType: 'Wedding',
  },
  {
    id: 'gal-12',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200',
    title: 'Couple Dance',
    category: 'Reception',
    eventType: 'Wedding',
  },
];

// Event Types
export const eventTypes = [
  'Wedding',
  'Engagement',
  'Pre-Wedding',
  'Sangeet',
  'Mehndi',
  'Haldi',
  'Reception',
  'Anniversary',
  'Birthday',
  'Corporate Event',
];

// Booking Status Options
export const bookingStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-purple-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

// Format price in Indian Rupees
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Get package by ID
export const getPackageById = (id: string): Package | undefined => {
  return packages.find(pkg => pkg.id === id);
};

// Get bookings by user ID
export const getBookingsByUserId = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

// Get bookings assigned to team member
export const getBookingsByTeamId = (teamId: string): Booking[] => {
  return bookings.filter(booking => booking.assignedTeam?.includes(teamId));
};
