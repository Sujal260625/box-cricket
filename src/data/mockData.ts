export interface Turf {
  id: string;
  name: string;
  location: string;
  type: string;
  pricePerHour: number;
  rating: number;
  image: string;
  facilities: string[];
  availability: string;
  description: string;
}

export interface Match {
  id: string;
  turfId: string;
  turfName: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: 'live' | 'upcoming' | 'completed';
  startTime: string;
  sport: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  status: 'open' | 'ongoing' | 'completed';
  image: string;
}

export interface Review {
  id: string;
  turfId: string;
  turfName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  turfId: string;
  turfName: string;
  userId: string;
  userName: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'busy' | 'offline';
  assignedTurf?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'food' | 'sports';
  price: number;
  stock: number;
  image: string;
  storeLocation: string;
}

export const mockTurfs: Turf[] = [
  {
    id: '1',
    name: 'Elite Football Arena',
    location: 'Downtown Sports Complex, 123 Main St',
    type: 'Football',
    pricePerHour: 500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZHxlbnwxfHx8fDE3Njc2MTkxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Floodlights', 'Changing Rooms', 'Parking', 'Cafeteria'],
    availability: 'Available',
    description: 'Premium quality football turf with international standards. Perfect for professional matches and training sessions.'
  },
  {
    id: '2',
    name: 'Grand Cricket Ground',
    location: 'Stadium Road, West Zone',
    type: 'Cricket',
    pricePerHour: 1000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwZ3JvdW5kfGVufDF8fHx8MTc2NzY5MjUwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Practice Nets', 'Pavilion', 'Scoreboard', 'Medical Room'],
    availability: 'Available',
    description: 'Full-size cricket ground with excellent pitch conditions and modern facilities for tournaments.'
  },
  {
    id: '3',
    name: 'Premium Basketball Court',
    location: 'City Center, 456 Sports Ave',
    type: 'Basketball',
    pricePerHour: 400,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzY3NTkzOTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Indoor Court', 'Spectator Seating', 'Locker Rooms', 'Water Station'],
    availability: 'Limited',
    description: 'Indoor basketball court with professional flooring and climate control for year-round play.'
  },
  {
    id: '4',
    name: 'MultiSport Arena',
    location: 'North Gate Complex',
    type: 'Multi-Sport',
    pricePerHour: 600,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1565483276060-e6730c0cc6a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtfGVufDF8fHx8MTc2NzYxNTEzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Multiple Courts', 'Equipment Rental', 'Café', 'Pro Shop'],
    availability: 'Available',
    description: 'Versatile sports facility supporting multiple sports including badminton, volleyball, and tennis.'
  }
];

export const mockMatches: Match[] = [
  {
    id: '1',
    turfId: '1',
    turfName: 'Elite Football Arena',
    team1: 'City Warriors',
    team2: 'United Stars',
    score1: 2,
    score2: 1,
    status: 'live',
    startTime: '2026-01-06T15:00:00',
    sport: 'Football'
  },
  {
    id: '2',
    turfId: '2',
    turfName: 'Grand Cricket Ground',
    team1: 'Thunder Strikers',
    team2: 'Royal Champions',
    score1: 145,
    score2: 98,
    status: 'live',
    startTime: '2026-01-06T10:00:00',
    sport: 'Cricket'
  },
  {
    id: '3',
    turfId: '3',
    turfName: 'Premium Basketball Court',
    team1: 'Phoenix Hoops',
    team2: 'Eagles Basketball',
    score1: 68,
    score2: 72,
    status: 'live',
    startTime: '2026-01-06T16:30:00',
    sport: 'Basketball'
  },
  {
    id: '4',
    turfId: '1',
    turfName: 'Elite Football Arena',
    team1: 'Dynamic FC',
    team2: 'Victory United',
    score1: 0,
    score2: 0,
    status: 'upcoming',
    startTime: '2026-01-07T14:00:00',
    sport: 'Football'
  }
];

export const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Winter Football Championship 2026',
    sport: 'Football',
    startDate: '2026-01-15',
    endDate: '2026-02-15',
    participants: 12,
    maxParticipants: 16,
    prize: '₹5,000',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZHxlbnwxfHx8fDE3Njc2MTkxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    name: 'Premier Cricket League',
    sport: 'Cricket',
    startDate: '2026-01-20',
    endDate: '2026-03-20',
    participants: 8,
    maxParticipants: 10,
    prize: '₹10,000',
    status: 'open',
    image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwZ3JvdW5kfGVufDF8fHx8MTc2NzY5MjUwM3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '3',
    name: '3v3 Basketball Tournament',
    sport: 'Basketball',
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    participants: 20,
    maxParticipants: 20,
    prize: '₹2,000',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzY3NTkzOTc0fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    turfId: '1',
    turfName: 'Elite Football Arena',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent facilities and well-maintained turf. The booking process was smooth and staff was very helpful.',
    date: '2026-01-05'
  },
  {
    id: '2',
    turfId: '2',
    turfName: 'Grand Cricket Ground',
    userName: 'Sarah Smith',
    rating: 5,
    comment: 'Best cricket ground in the area! Perfect pitch conditions and great amenities.',
    date: '2026-01-04'
  },
  {
    id: '3',
    turfId: '3',
    turfName: 'Premium Basketball Court',
    userName: 'Mike Johnson',
    rating: 4,
    comment: 'Good indoor court with proper flooring. Could use better lighting but overall great experience.',
    date: '2026-01-03'
  },
  {
    id: '4',
    turfId: '1',
    turfName: 'Elite Football Arena',
    userName: 'Emma Wilson',
    rating: 5,
    comment: 'Loved playing here! Clean facilities and easy parking. Will definitely book again.',
    date: '2026-01-02'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    turfId: '1',
    turfName: 'Elite Football Arena',
    userId: '3',
    userName: 'John Player',
    date: '2026-01-08',
    timeSlot: '14:00 - 16:00',
    duration: 2,
    totalPrice: 1000,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: '2',
    turfId: '2',
    turfName: 'Grand Cricket Ground',
    userId: '3',
    userName: 'John Player',
    date: '2026-01-10',
    timeSlot: '09:00 - 12:00',
    duration: 3,
    totalPrice: 3000,
    status: 'confirmed',
    paymentStatus: 'paid'
  },
  {
    id: '3',
    turfId: '3',
    turfName: 'Premium Basketball Court',
    userId: '4',
    userName: 'Sarah Player',
    date: '2026-01-07',
    timeSlot: '18:00 - 19:00',
    duration: 1,
    totalPrice: 400,
    status: 'pending',
    paymentStatus: 'pending'
  }
];

export const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Alex Manager',
    role: 'Ground Manager',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Elite Football Arena'
    },
    status: 'available',
    assignedTurf: '1'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    role: 'Maintenance Staff',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: 'Grand Cricket Ground'
    },
    status: 'busy',
    assignedTurf: '2'
  },
  {
    id: '3',
    name: 'David Chen',
    role: 'Store Manager',
    location: {
      lat: 40.7489,
      lng: -73.9680,
      address: 'Premium Basketball Court'
    },
    status: 'available',
    assignedTurf: '3'
  }
];

export const mockStoreItems: StoreItem[] = [
  {
    id: '1',
    name: 'Energy Drink',
    category: 'food',
    price: 80,
    stock: 50,
    image: './Cans_Design.jpeg',
    storeLocation: 'Elite Football Arena'
  },
  {
    id: '2',
    name: 'Protein Bar',
    category: 'food',
    price: 75,
    stock: 100,
    image: './protein_bar.jpeg',
    storeLocation: 'Elite Football Arena'
  },
  {
    id: '3',
    name: 'Football',
    category: 'sports',
    price: 1200,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400',
    storeLocation: 'Elite Football Arena'
  },
  {
    id: '4',
    name: 'Cricket Bat',
    category: 'sports',
    price: 4500,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
    storeLocation: 'Grand Cricket Ground'
  },
  {
    id: '5',
    name: 'Basketball',
    category: 'sports',
    price: 1500,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    storeLocation: 'Premium Basketball Court'
  }
];
