import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

/**
 * Seed CMS Data for MotoManiacs
 * 
 * This script populates initial CMS content including:
 * - Ecosystem page
 * - Ecosystem segments
 * - Vision & Mission
 * - Institution cards
 * - Sample products
 * 
 * Run with: npx ts-node scripts/seedCMSData.ts
 * Or: npm run seed-cms
 */

// Initialize Firebase (use your actual config)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// Image References
// ============================================
// After uploading images to Firebase Storage, update these URLs
const IMAGES = {
    ecosystemDiagram: 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/ecosystem-diagram.png?alt=media',
    visionMissionHero: 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/vision-mission-hero.png?alt=media',
    institutionCampus: 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/institution-campus.png?alt=media',
    trackAndCars: 'https://firebasestorage.googleapis.com/v0/b/your-bucket/o/track-cars.png?alt=media',
};

async function seedEcosystemPage() {
    console.log('🌐 Seeding Ecosystem Page...');

    const ecosystemPage = {
        slug: 'ecosystem',
        title: 'MotoManiacs Ecosystem',
        metaDescription: 'Discover the complete MotoManiacs ecosystem - from track days to talent development',
        published: true,
        sections: [
            {
                sectionId: 'hero',
                sectionType: 'hero',
                title: 'The Complete Motorsport Ecosystem',
                content: 'MotoManiacs is more than events - it\'s a complete ecosystem connecting enthusiasts, institutions, and industry.',
                imageUrl: IMAGES.ecosystemDiagram,
                order: 0,
            },
            {
                sectionId: 'ecosystem',
                sectionType: 'ecosystem',
                title: 'Our Ecosystem',
                order: 1,
            },
            {
                sectionId: 'visionMission',
                sectionType: 'visionMission',
                title: 'Vision & Mission',
                order: 2,
            },
            {
                sectionId: 'institutionEngagement',
                sectionType: 'institutionEngagement',
                title: 'Institutional Engagement',
                imageUrl: IMAGES.institutionCampus,
                order: 3,
            },
            {
                sectionId: 'trackAndCars',
                sectionType: 'trackAndCars',
                title: 'Track & Cars',
                imageUrl: IMAGES.trackAndCars,
                order: 4,
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'pages'), ecosystemPage);
    console.log('✅ Ecosystem page created');
}

async function seedEcosystemSegments() {
    console.log('🔧 Seeding Ecosystem Segments...');

    const segments = [
        {
            iconName: 'calendar',
            title: 'Events & Track Days',
            shortDescription: 'Premium motorsport events and exclusive track experiences',
            order: 0,
        },
        {
            iconName: 'store',
            title: 'Superstore',
            shortDescription: 'Authentic racing gear, parts, and merchandise',
            order: 1,
        },
        {
            iconName: 'users',
            title: 'Community',
            shortDescription: 'Connect with fellow enthusiasts and professionals',
            order: 2,
        },
        {
            iconName: 'school',
            title: 'Campus Activation',
            shortDescription: 'Bringing motorsport culture to educational institutions',
            order: 3,
        },
        {
            iconName: 'trophy',
            title: 'Talent Hunt',
            shortDescription: 'Discover and nurture the next generation of motorsport talent',
            order: 4,
        },
        {
            iconName: 'zap',
            title: 'Arrive & Drive',
            shortDescription: 'Instant track access - no car, no problem',
            order: 5,
        },
    ];

    for (const segment of segments) {
        await addDoc(collection(db, 'ecosystemSegments'), segment);
    }

    console.log('✅ Created 6 ecosystem segments');
}

async function seedVisionMission() {
    console.log('🎯 Seeding Vision & Mission...');

    const visionMission = {
        visionText: `To create India's most vibrant and inclusive motorsport ecosystem, where passion meets opportunity. 
    We envision a future where motorsport is accessible to everyone - from the curious beginner to the aspiring professional.
    
    Our vision extends beyond the track, fostering a community that celebrates speed, precision, and the relentless pursuit of excellence.`,

        missionText: `Democratize motorsport through innovative experiences and educational initiatives.
    
    Build bridges between institutions, industry, and enthusiasts to create pathways for talent discovery and development.
    
    Provide world-class facilities, authentic products, and unforgettable experiences that inspire the next generation of motorsport champions.`,

        heroImagePath: IMAGES.visionMissionHero,
        updatedAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'visionMission'), visionMission);
    console.log('✅ Vision & Mission created');
}

async function seedInstitutionCards() {
    console.log('🏫 Seeding Institution Cards...');

    const cards = [
        {
            title: 'Campus Activation Programs',
            bullets: [
                'Interactive motorsport workshops and seminars',
                'Track day experiences for students',
                'Career guidance in automotive industry',
                'Technical competitions and challenges',
                'Industry mentorship programs',
            ],
            accentColor: '#dc2626', // Red
            order: 0,
        },
        {
            title: 'Talent Development Initiatives',
            bullets: [
                'Scholarship opportunities for promising talent',
                'Professional driver training programs',
                'Internships with racing teams and manufacturers',
                'Technical skill development workshops',
                'Networking with industry professionals',
            ],
            accentColor: '#2563eb', // Blue
            order: 1,
        },
        {
            title: 'Institutional Partnerships',
            bullets: [
                'Customized event packages for colleges',
                'Co-branded motorsport festivals',
                'Research collaboration opportunities',
                'Student ambassador programs',
                'Exclusive campus track days',
            ],
            accentColor: '#16a34a', // Green
            order: 2,
        },
    ];

    for (const card of cards) {
        await addDoc(collection(db, 'institutionCards'), card);
    }

    console.log('✅ Created 3 institution cards');
}

async function seedSampleProducts() {
    console.log('🏪 Seeding Sample Products...');

    const products = [
        {
            title: 'MotoManiacs Racing Helmet',
            sku: 'MM-HELMET-001',
            price: 12999,
            compareAtPrice: 15999,
            inventory: 25,
            images: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            ],
            description: 'Professional-grade racing helmet with advanced safety features. DOT and Snell certified for maximum protection on track.',
            shortDescription: 'DOT/Snell certified racing helmet',
            categories: ['Safety Gear', 'Helmets'],
            brand: 'MotoManiacs',
            featured: true,
            specifications: {
                'Safety Rating': 'DOT, Snell SA2020',
                'Weight': '1.4kg',
                'Shell Material': 'Carbon Fiber',
                'Sizes Available': 'S, M, L, XL',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Racing Gloves - Pro Series',
            sku: 'MM-GLOVES-PRO',
            price: 4999,
            inventory: 50,
            images: [
                'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800',
            ],
            description: 'Ultra-grip racing gloves with fire-resistant material. Engineered for precision control and maximum safety.',
            shortDescription: 'Fire-resistant racing gloves',
            categories: ['Safety Gear', 'Gloves'],
            brand: 'MotoManiacs',
            featured: true,
            specifications: {
                'Material': 'Nomex, Leather',
                'Fire Rating': 'FIA 8856-2018',
                'Grip Technology': 'Nano-grip palm patches',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'MotoManiacs Track Day Package',
            sku: 'MM-TRACK-PKG',
            price: 25000,
            inventory: 100,
            images: [
                'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
            ],
            description: 'Complete track day experience package including safety briefing, timing equipment, and professional photography.',
            shortDescription: 'All-inclusive track day experience',
            categories: ['Experiences', 'Track Days'],
            brand: 'MotoManiacs',
            featured: true,
            specifications: {
                'Duration': 'Full Day',
                'Includes': 'Safety gear rental, timing, photos',
                'Sessions': '4 x 20-minute sessions',
                'Support': 'Professional instructors',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'MotoManiacs Branded T-Shirt',
            sku: 'MM-TSHIRT-001',
            price: 999,
            compareAtPrice: 1299,
            inventory: 200,
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
            ],
            description: 'Premium cotton t-shirt with iconic MotoManiacs racing graphics. Comfortable for everyday wear or track days.',
            shortDescription: 'Official MotoManiacs merchandise',
            categories: ['Merchandise', 'Apparel'],
            brand: 'MotoManiacs',
            featured: false,
            specifications: {
                'Material': '100% Cotton',
                'Fit': 'Regular',
                'Sizes': 'S, M, L, XL, XXL',
                'Care': 'Machine washable',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    for (const product of products) {
        await addDoc(collection(db, 'products'), product);
    }

    console.log('✅ Created 4 sample products');
}

async function seedAvailabilitySlots() {
    console.log('📅 Seeding Availability Slots...');

    const today = new Date();
    const slots = [];

    // Create slots for the next 30 days
    for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Morning slot
        slots.push({
            date: date.toISOString().split('T')[0],
            timeSlot: '10:00 AM - 12:00 PM',
            capacity: 20,
            booked: Math.floor(Math.random() * 10), // Random bookings
            price: 3500,
            vehicleType: 'Both',
            trackLocation: 'MotoManiacs Circuit - Bangalore',
        });

        // Afternoon slot
        slots.push({
            date: date.toISOString().split('T')[0],
            timeSlot: '2:00 PM - 4:00 PM',
            capacity: 20,
            booked: Math.floor(Math.random() * 10),
            price: 3500,
            vehicleType: 'Both',
            trackLocation: 'MotoManiacs Circuit - Bangalore',
        });
    }

    for (const slot of slots) {
        await addDoc(collection(db, 'availabilitySlots'), slot);
    }

    console.log(`✅ Created ${slots.length} availability slots`);
}

// ============================================
// Main Seed Function
// ============================================

async function seedAll() {
    console.log('🌱 Starting CMS data seeding...\n');

    try {
        await seedEcosystemPage();
        await seedEcosystemSegments();
        await seedVisionMission();
        await seedInstitutionCards();
        await seedSampleProducts();
        await seedAvailabilitySlots();

        console.log('\n✅ ✅ ✅ All data seeded successfully! ✅ ✅ ✅');
        console.log('\nNext steps:');
        console.log('1. Upload images to Firebase Storage (see uploadImages.md)');
        console.log('2. Update image URLs in Firestore documents');
        console.log('3. Start the dev server: npm run dev');
        console.log('4. Visit /ecosystem to see your new page!');

    } catch (error) {
        console.error('\n❌ Error seeding data:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedAll();
}

export { seedAll };
