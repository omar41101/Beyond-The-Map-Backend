import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import NFT from '../models/NFT.js';
import Agency from '../models/Agency.js';
import Artist from '../models/Artist.js';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

dotenv.config();

// Sample data
const users = [
    {
        email: 'admin@btm.com',
        password: 'Admin@123',
        fullName: 'Admin User',
        phone: '+1234567890',
        role: 'admin'
    },
    {
        email: 'agency1@btm.com',
        password: 'Agency@123',
        fullName: 'Morocco Adventures Agency',
        phone: '+1234567891',
        role: 'agency',
        hederaAccountId: '0.0.1001'
    },
    {
        email: 'agency2@btm.com',
        password: 'Agency@123',
        fullName: 'Desert Tours Co',
        phone: '+1234567892',
        role: 'agency',
        hederaAccountId: '0.0.1002'
    },
    {
        email: 'artist1@btm.com',
        password: 'Artist@123',
        fullName: 'Fatima Pottery',
        phone: '+1234567893',
        role: 'artist',
        hederaAccountId: '0.0.1003'
    },
    {
        email: 'artist2@btm.com',
        password: 'Artist@123',
        fullName: 'Hassan Textiles',
        phone: '+1234567894',
        role: 'artist',
        hederaAccountId: '0.0.1004'
    },
    {
        email: 'user1@btm.com',
        password: 'User@123',
        fullName: 'John Doe',
        phone: '+1234567895',
        role: 'user',
        hederaAccountId: '0.0.1005'
    },
    {
        email: 'user2@btm.com',
        password: 'User@123',
        fullName: 'Jane Smith',
        phone: '+1234567896',
        role: 'user',
        hederaAccountId: '0.0.1006'
    },
    {
        email: 'user3@btm.com',
        password: 'User@123',
        fullName: 'Ahmed Hassan',
        phone: '+1234567897',
        role: 'user'
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Tour.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await NFT.deleteMany({});
        await Agency.deleteMany({});
        await Artist.deleteMany({});
        await Product.deleteMany({});

        // Create users
        console.log('👥 Creating users...');
        const createdUsers = await User.create(users);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Get user references
        const admin = createdUsers.find(u => u.role === 'admin');
        const agency1 = createdUsers.find(u => u.email === 'agency1@btm.com');
        const agency2 = createdUsers.find(u => u.email === 'agency2@btm.com');
        const artist1 = createdUsers.find(u => u.email === 'artist1@btm.com');
        const artist2 = createdUsers.find(u => u.email === 'artist2@btm.com');
        const tourist1 = createdUsers.find(u => u.email === 'user1@btm.com');
        const tourist2 = createdUsers.find(u => u.email === 'user2@btm.com');
        const tourist3 = createdUsers.find(u => u.email === 'user3@btm.com');

        // Create agencies
        console.log('🏢 Creating agencies...');
        const agencies = await Agency.create([
            {
                user: agency1._id,
                companyName: 'Morocco Adventures',
                licenseNumber: 'MA-2024-001',
                description: 'Leading tour operator in Morocco specializing in cultural and adventure tours',
                address: {
                    street: '123 Medina Street',
                    city: 'Marrakech',
                    country: 'Morocco',
                    zipCode: '40000'
                },
                contactInfo: {
                    phone: '+212-524-123456',
                    email: 'info@moroccoAdventures.com',
                    website: 'www.moroccoAdventures.com'
                },
                status: 'approved',
                approvedBy: admin._id,
                approvedAt: new Date(),
                rating: 4.8,
                totalTours: 0,
                totalBookings: 0
            },
            {
                user: agency2._id,
                companyName: 'Desert Tours Company',
                licenseNumber: 'DT-2024-002',
                description: 'Specializing in Sahara desert experiences and camel trekking',
                address: {
                    street: '456 Kasbah Road',
                    city: 'Merzouga',
                    country: 'Morocco',
                    zipCode: '52202'
                },
                contactInfo: {
                    phone: '+212-535-987654',
                    email: 'contact@deserttours.com',
                    website: 'www.deserttours.com'
                },
                status: 'approved',
                approvedBy: admin._id,
                approvedAt: new Date(),
                rating: 4.6,
                totalTours: 0,
                totalBookings: 0
            }
        ]);
        console.log(`✅ Created ${agencies.length} agencies`);

        // Create artists
        console.log('🎨 Creating artists...');
        const artists = await Artist.create([
            {
                user: artist1._id,
                artistName: 'Fatima Pottery Master',
                bio: 'Traditional Moroccan pottery artist with 20 years of experience',
                specialty: 'pottery',
                experience: 20,
                portfolio: [
                    {
                        title: 'Blue Fez Pottery',
                        description: 'Traditional blue pottery from Fez',
                        image: 'https://example.com/pottery1.jpg'
                    }
                ],
                status: 'approved',
                approvedBy: admin._id,
                approvedAt: new Date(),
                rating: 4.9
            },
            {
                user: artist2._id,
                artistName: 'Hassan Textile Art',
                bio: 'Master weaver specializing in traditional Berber textiles',
                specialty: 'textiles',
                experience: 15,
                portfolio: [
                    {
                        title: 'Berber Carpets',
                        description: 'Handwoven traditional carpets',
                        image: 'https://example.com/textile1.jpg'
                    }
                ],
                status: 'approved',
                approvedBy: admin._id,
                approvedAt: new Date(),
                rating: 4.7
            }
        ]);
        console.log(`✅ Created ${artists.length} artists`);

        // Create products
        console.log('🛍️  Creating products...');
        const products = await Product.create([
            {
                artist: artists[0]._id,
                name: 'Traditional Blue Fez Pottery Vase',
                description: 'Handcrafted traditional Moroccan pottery vase with authentic blue Fez glaze. Each piece is unique and made using centuries-old techniques.',
                category: 'pottery',
                price: 89.99,
                stockQuantity: 5,
                images: [
                    { url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500', alt: 'Blue pottery vase' }
                ],
                materials: ['Clay', 'Natural glaze'],
                colors: ['Blue', 'White'],
                status: 'active',
                featured: true
            },
            {
                artist: artists[0]._id,
                name: 'Moroccan Ceramic Bowl Set',
                description: 'Set of 4 hand-painted ceramic bowls perfect for serving traditional Moroccan dishes.',
                category: 'pottery',
                price: 65.00,
                stockQuantity: 8,
                images: [
                    { url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500', alt: 'Ceramic bowl set' }
                ],
                materials: ['Ceramic', 'Natural paint'],
                colors: ['Multicolor'],
                status: 'active'
            },
            {
                artist: artists[1]._id,
                name: 'Handwoven Berber Carpet - Medium',
                description: 'Authentic Berber carpet handwoven by skilled artisans. Features traditional geometric patterns and natural wool.',
                category: 'textiles',
                price: 299.99,
                stockQuantity: 3,
                images: [
                    { url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500', alt: 'Berber carpet' }
                ],
                dimensions: { length: 200, width: 150, height: 2, unit: 'cm' },
                materials: ['Wool', 'Natural dyes'],
                colors: ['Beige', 'Brown', 'Red'],
                status: 'active',
                featured: true
            },
            {
                artist: artists[1]._id,
                name: 'Traditional Moroccan Throw Pillow',
                description: 'Handwoven decorative pillow with traditional Berber motifs. Perfect accent for any room.',
                category: 'textiles',
                price: 45.00,
                stockQuantity: 12,
                images: [
                    { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', alt: 'Moroccan pillow' }
                ],
                materials: ['Cotton', 'Wool'],
                colors: ['Orange', 'Blue', 'White'],
                status: 'active'
            },
            {
                artist: artists[0]._id,
                name: 'Decorative Tagine Pot',
                description: 'Traditional Moroccan tagine pot with intricate hand-painted designs. Functional and decorative.',
                category: 'pottery',
                price: 125.00,
                stockQuantity: 4,
                images: [
                    { url: 'https://images.unsplash.com/photo-1600555379765-f82335a05b0b?w=500', alt: 'Tagine pot' }
                ],
                materials: ['Clay', 'Ceramic glaze'],
                colors: ['Red', 'Orange', 'Yellow'],
                status: 'active'
            },
            {
                artist: artists[1]._id,
                name: 'Woven Basket - Large',
                description: 'Large handwoven basket made from natural palm fibers. Perfect for storage or display.',
                category: 'basketry',
                price: 55.00,
                stockQuantity: 6,
                images: [
                    { url: 'https://images.unsplash.com/photo-1551975137-3a5fd2a2f4af?w=500', alt: 'Woven basket' }
                ],
                materials: ['Palm fiber'],
                colors: ['Natural', 'Brown'],
                status: 'active'
            }
        ]);
        console.log(`✅ Created ${products.length} products`);

        // Update artist product counts
        artists[0].totalProducts = 3;
        artists[1].totalProducts = 3;
        await artists[0].save();
        await artists[1].save();

        // Create tours
        console.log('🗺️  Creating tours...');
        const tours = await Tour.create([
            {
                name: 'Marrakech Medina Discovery',
                description: 'Explore the vibrant souks, palaces, and gardens of Marrakech. Visit the famous Jemaa el-Fnaa square and experience authentic Moroccan culture.',
                location: 'Marrakech, Morocco',
                price: 89.99,
                duration: 1,
                maxParticipants: 15,
                category: 'cultural',
                images: ['https://example.com/marrakech1.jpg', 'https://example.com/marrakech2.jpg'],
                agency: agency1._id,
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                availableDates: [
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
                ],
                isActive: true,
                rating: 4.8,
                reviewCount: 24
            },
            {
                name: 'Sahara Desert Adventure',
                description: 'Experience the magic of the Sahara Desert with camel trekking, desert camping, and stunning sunsets over the dunes.',
                location: 'Merzouga, Morocco',
                price: 299.99,
                duration: 3,
                maxParticipants: 10,
                category: 'adventure',
                images: ['https://example.com/sahara1.jpg', 'https://example.com/sahara2.jpg'],
                agency: agency2._id,
                hederaTourId: '0.0.5001',
                startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
                availableDates: [
                    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    new Date(Date.now() + 17 * 24 * 60 * 60 * 1000)
                ],
                isActive: true,
                rating: 4.9,
                reviewCount: 18
            },
            {
                name: 'Fez Historical Tour',
                description: 'Discover the ancient city of Fez, visit traditional tanneries, madrasas, and the oldest university in the world.',
                location: 'Fez, Morocco',
                price: 79.99,
                duration: 1,
                maxParticipants: 20,
                category: 'historical',
                images: ['https://example.com/fez1.jpg'],
                agency: agency1._id,
                startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                availableDates: [
                    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
                ],
                isActive: true,
                rating: 4.6,
                reviewCount: 15
            },
            {
                name: 'Atlas Mountains Trekking',
                description: 'Trek through the beautiful Atlas Mountains, visit Berber villages, and enjoy breathtaking mountain scenery.',
                location: 'Atlas Mountains, Morocco',
                price: 199.99,
                duration: 2,
                maxParticipants: 12,
                category: 'nature',
                images: ['https://example.com/atlas1.jpg'],
                agency: agency1._id,
                startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
                availableDates: [
                    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                ],
                isActive: true,
                rating: 4.7,
                reviewCount: 12
            },
            {
                name: 'Chefchaouen Blue City Tour',
                description: 'Explore the stunning blue-painted streets of Chefchaouen, Morocco\'s most photogenic city.',
                location: 'Chefchaouen, Morocco',
                price: 69.99,
                duration: 1,
                maxParticipants: 15,
                category: 'cultural',
                images: ['https://example.com/chefchaouen1.jpg'],
                agency: agency2._id,
                startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
                availableDates: [
                    new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                ],
                isActive: true,
                rating: 4.5,
                reviewCount: 20
            }
        ]);
        console.log(`✅ Created ${tours.length} tours`);

        // Create bookings
        console.log('📅 Creating bookings...');
        const bookings = await Booking.create([
            {
                tour: tours[0]._id,
                user: tourist1._id,
                bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                numberOfParticipants: 2,
                totalPrice: 179.98,
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: 'fiat',
                fiatPayment: {
                    transactionId: 'TXN123456',
                    paymentGateway: 'stripe',
                    cardLast4: '4242',
                    paymentDate: new Date(),
                    currency: 'USD'
                }
            },
            {
                tour: tours[1]._id,
                user: tourist1._id,
                bookingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                numberOfParticipants: 2,
                totalPrice: 599.98,
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: 'hedera',
                hederaTransactionId: '0.0.123456@1234567890.123456789'
            },
            {
                tour: tours[2]._id,
                user: tourist2._id,
                bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                numberOfParticipants: 1,
                totalPrice: 79.99,
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: 'fiat',
                fiatPayment: {
                    transactionId: 'TXN789012',
                    paymentGateway: 'paypal',
                    paymentDate: new Date(),
                    currency: 'USD'
                }
            },
            {
                tour: tours[3]._id,
                user: tourist3._id,
                bookingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                numberOfParticipants: 3,
                totalPrice: 599.97,
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: 'fiat'
            },
            {
                tour: tours[4]._id,
                user: tourist2._id,
                bookingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                numberOfParticipants: 2,
                totalPrice: 139.98,
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: 'cash'
            }
        ]);
        console.log(`✅ Created ${bookings.length} bookings`);

        // Create reviews
        console.log('⭐ Creating reviews...');
        const reviews = await Review.create([
            {
                tour: tours[0]._id,
                user: tourist1._id,
                booking: bookings[0]._id,
                rating: 5,
                comment: 'Amazing experience! Our guide was knowledgeable and the medina was fascinating.',
                isVerified: true
            },
            {
                tour: tours[1]._id,
                user: tourist1._id,
                booking: bookings[1]._id,
                rating: 5,
                comment: 'The Sahara desert was absolutely breathtaking. Worth every penny!',
                isVerified: true
            },
            {
                tour: tours[2]._id,
                user: tourist2._id,
                booking: bookings[2]._id,
                rating: 4,
                comment: 'Great tour of Fez. Very informative and well organized.',
                isVerified: true
            }
        ]);
        console.log(`✅ Created ${reviews.length} reviews`);

        // Create NFTs
        console.log('🎨 Creating NFTs...');
        const nfts = await NFT.create([
            {
                tokenId: 'NFT-POV-001',
                type: 'proof_of_visit',
                owner: tourist1._id,
                serialNumber: '1',
                metadata: {
                    name: 'Marrakech Medina Visit 2024',
                    description: 'Proof of visit to Marrakech Medina',
                    image: 'https://example.com/nft1.jpg',
                    attributes: [
                        { trait_type: 'Location', value: 'Marrakech' },
                        { trait_type: 'Date', value: new Date().toISOString() }
                    ]
                },
                relatedTour: tours[0]._id,
                relatedBooking: bookings[0]._id,
                hederaTransactionId: '0.0.123456@1234567890.123456789'
            },
            {
                tokenId: 'NFT-ART-001',
                type: 'artisanat',
                owner: artist1._id,
                serialNumber: '1',
                metadata: {
                    name: 'Blue Fez Pottery',
                    description: 'Traditional Moroccan pottery',
                    image: 'https://example.com/pottery-nft.jpg',
                    attributes: [
                        { trait_type: 'Artist', value: 'Fatima Pottery Master' },
                        { trait_type: 'Type', value: 'Pottery' }
                    ]
                },
                hederaTransactionId: '0.0.123456@1234567890.987654321'
            }
        ]);
        console.log(`✅ Created ${nfts.length} NFTs`);

        // Update booking with NFT
        bookings[0].nftMinted = true;
        bookings[0].nftSerialNumber = '1';
        await bookings[0].save();

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   👥 Users: ${createdUsers.length}`);
        console.log(`   🏢 Agencies: ${agencies.length}`);
        console.log(`   🎨 Artists: ${artists.length}`);
        console.log(`   🛍️  Products: ${products.length}`);
        console.log(`   🗺️  Tours: ${tours.length}`);
        console.log(`   📅 Bookings: ${bookings.length}`);
        console.log(`   ⭐ Reviews: ${reviews.length}`);
        console.log(`   🎨 NFTs: ${nfts.length}`);
        console.log('\n🔑 Test Credentials:');
        console.log('   Admin:   admin@btm.com / Admin@123');
        console.log('   Agency:  agency1@btm.com / Agency@123');
        console.log('   Artist:  artist1@btm.com / Artist@123');
        console.log('   Tourist: user1@btm.com / User@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
