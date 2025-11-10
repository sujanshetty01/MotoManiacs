import { Event, EventType } from '../types';

export const mockEvents: Event[] = [
  {
    // FIX: Changed id from number to string.
    id: '1',
    title: 'MidnightDrift Championship',
    date: '2024-08-15T20:00:00Z',
    venue: 'Apex Racing Circuit',
    price: 75,
    description: 'Experience the thrill of high-speed drifting under the stars. Top drivers compete for the ultimate title.',
    duration: '4 hours',
    images: [
      'https://picsum.photos/seed/midnightdrift/800/600',
      'https://picsum.photos/seed/driftcar2/800/600',
      'https://picsum.photos/seed/driftcrowd/800/600',
    ],
    type: EventType.Car,
    featured: true,
  },
  {
    // FIX: Changed id from number to string.
    id: '2',
    title: 'Superbike Sprint Series',
    date: '2024-09-05T14:00:00Z',
    venue: 'Velocity Raceway',
    price: 60,
    description: 'Feel the roar of superbikes as they tear up the track in a series of high-stakes sprint races.',
    duration: '3 hours',
    images: [
      'https://picsum.photos/seed/superbike/800/600',
      'https://picsum.photos/seed/bikerace/800/600',
    ],
    type: EventType.Bike,
    featured: true,
  },
  {
    // FIX: Changed id from number to string.
    id: '3',
    title: 'Classic & Custom Car Expo',
    date: '2024-09-21T10:00:00Z',
    venue: 'Grand Exhibition Hall',
    price: 30,
    description: 'A showcase of timeless classics and breathtaking custom builds. A must-see for every auto enthusiast.',
    duration: '8 hours',
    images: [
      'https://picsum.photos/seed/classiccar/800/600',
      'https://picsum.photos/seed/customcar/800/600',
      'https://picsum.photos/seed/vintageauto/800/600',
    ],
    type: EventType.Car,
    featured: false,
  },
  {
    // FIX: Changed id from number to string.
    id: '4',
    title: 'MotoCross Mayhem',
    date: '2024-10-12T11:00:00Z',
    venue: 'Dirt Devil Arena',
    price: 45,
    description: 'Get ready for mud, jumps, and adrenaline-pumping motocross action with the toughest riders.',
    duration: '5 hours',
    images: [
      'https://picsum.photos/seed/motocross/800/600',
      'https://picsum.photos/seed/dirtbike/800/600',
    ],
    type: EventType.Bike,
    featured: true,
  },
  {
    // FIX: Changed id from number to string.
    id: '5',
    title: 'Urban Tuner Night',
    date: '2024-11-02T19:00:00Z',
    venue: 'Cityscape Parkade',
    price: 25,
    description: 'The underground tuner scene comes to light. Neon, custom mods, and heart-pounding bass.',
    duration: '4 hours',
    images: [
      'https://picsum.photos/seed/tuner/800/600',
      'https://picsum.photos/seed/neoncars/800/600',
    ],
    type: EventType.Car,
    featured: false,
  },
   {
    // FIX: Changed id from number to string.
    id: '6',
    title: 'Vintage Motorcycle Rally',
    date: '2024-11-23T09:00:00Z',
    venue: 'Heritage Valley',
    price: 20,
    description: 'A journey back in time with beautifully restored vintage motorcycles. A day of chrome, leather, and nostalgia.',
    duration: '6 hours',
    images: [
      'https://picsum.photos/seed/vintagemoto/800/600',
      'https://picsum.photos/seed/oldbike/800/600',
    ],
    type: EventType.Bike,
    featured: false,
  },
];
