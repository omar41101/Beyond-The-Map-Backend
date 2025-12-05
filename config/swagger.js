import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Beyond The Map API',
            version: '1.0.0',
            description: `
# Beyond The Map - Complete API Documentation

A comprehensive Web3 tourism platform backend API built on Hedera blockchain integration.

## Features
- 🔐 **User Authentication**: JWT-based authentication with role-based access control
- 🗺️ **Tour Management**: Create, browse, and book tours
- 💳 **Payment Processing**: Dual payment support (Hedera & traditional fiat)
- 🎨 **NFT Minting**: Proof of visit and artisan NFTs on Hedera
- 🏢 **Agency Management**: Agency registration and tour management
- 👨‍🎨 **Artist Marketplace**: Local artisan product marketplace
- ⭐ **Reviews & Ratings**: Verified tour reviews
- 📊 **Analytics**: Comprehensive dashboards for all user types

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Roles
- **User/Tourist**: Book tours, mint NFTs, leave reviews
- **Agency**: Manage tours, view bookings
- **Artist**: Create and sell products
- **Admin**: Full platform management

## Payment Methods
- Hedera blockchain payments (HBAR)
- Traditional fiat payments (Stripe, PayPal, Square)
- Cash payments (on-site)

## Error Handling
All errors follow a consistent format:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
\`\`\`
            `,
            contact: {
                name: 'API Support',
                email: 'support@beyondthemap.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:9999',
                description: 'Development server',
            },
            {
                url: 'https://api.beyondthemap.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        fullName: {
                            type: 'string',
                            description: 'User full name',
                        },
                        phone: {
                            type: 'string',
                            description: 'User phone number',
                        },
                        hederaAccountId: {
                            type: 'string',
                            description: 'Linked Hedera account ID',
                            example: '0.0.5876113',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'agency', 'artist', 'admin'],
                            description: 'User role',
                        },
                        profileImage: {
                            type: 'string',
                            description: 'Profile image URL',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation date',
                        },
                    },
                },
                Tour: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        location: { type: 'string' },
                        price: { type: 'number' },
                        duration: { type: 'number', description: 'Duration in days' },
                        maxParticipants: { type: 'number' },
                        category: { 
                            type: 'string',
                            enum: ['cultural', 'adventure', 'historical', 'nature', 'culinary', 'wellness']
                        },
                        images: { 
                            type: 'array',
                            items: { type: 'string' }
                        },
                        agency: { type: 'string', description: 'Agency ID' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                        availableDates: {
                            type: 'array',
                            items: { type: 'string', format: 'date-time' }
                        },
                        isActive: { type: 'boolean' },
                        rating: { type: 'number' },
                        reviewCount: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Booking: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        tour: { type: 'string', description: 'Tour ID' },
                        user: { type: 'string', description: 'User ID' },
                        bookingDate: { type: 'string', format: 'date-time' },
                        numberOfParticipants: { type: 'number' },
                        totalPrice: { type: 'number' },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'completed', 'cancelled']
                        },
                        paymentStatus: {
                            type: 'string',
                            enum: ['pending', 'paid', 'refunded']
                        },
                        paymentMethod: {
                            type: 'string',
                            enum: ['wallet', 'hedera', 'fiat', 'cash']
                        },
                        hederaTransactionId: { type: 'string' },
                        fiatPayment: {
                            type: 'object',
                            properties: {
                                transactionId: { type: 'string' },
                                paymentGateway: { type: 'string' },
                                cardLast4: { type: 'string' },
                                paymentDate: { type: 'string', format: 'date-time' },
                                currency: { type: 'string' },
                                receiptUrl: { type: 'string' }
                            }
                        },
                        specialRequests: { type: 'string' },
                        nftMinted: { type: 'boolean' },
                        nftSerialNumber: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                NFT: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        tokenId: { type: 'string' },
                        type: {
                            type: 'string',
                            enum: ['proof_of_visit', 'artisanat', 'tour_package']
                        },
                        owner: { type: 'string', description: 'User ID' },
                        serialNumber: { type: 'string' },
                        metadata: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                description: { type: 'string' },
                                image: { type: 'string' },
                                attributes: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            trait_type: { type: 'string' },
                                            value: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        },
                        relatedTour: { type: 'string' },
                        relatedBooking: { type: 'string' },
                        hederaTransactionId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Agency: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string', description: 'User ID' },
                        companyName: { type: 'string' },
                        licenseNumber: { type: 'string' },
                        description: { type: 'string' },
                        address: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                city: { type: 'string' },
                                country: { type: 'string' },
                                zipCode: { type: 'string' }
                            }
                        },
                        contactInfo: {
                            type: 'object',
                            properties: {
                                phone: { type: 'string' },
                                email: { type: 'string' },
                                website: { type: 'string' }
                            }
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'rejected', 'suspended']
                        },
                        rating: { type: 'number' },
                        totalTours: { type: 'number' },
                        totalBookings: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Artist: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string', description: 'User ID' },
                        artistName: { type: 'string' },
                        bio: { type: 'string' },
                        specialty: {
                            type: 'string',
                            enum: ['pottery', 'textiles', 'jewelry', 'leather', 'woodwork', 'metalwork', 'basketry', 'painting', 'other']
                        },
                        experience: { type: 'number', description: 'Years of experience' },
                        portfolio: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    image: { type: 'string' }
                                }
                            }
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'rejected', 'suspended']
                        },
                        rating: { type: 'number' },
                        totalProducts: { type: 'number' },
                        totalSales: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        artist: { type: 'string', description: 'Artist ID' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        category: {
                            type: 'string',
                            enum: ['pottery', 'textiles', 'jewelry', 'leather', 'woodwork', 'metalwork', 'basketry', 'painting', 'other']
                        },
                        price: { type: 'number' },
                        stockQuantity: { type: 'number' },
                        images: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    url: { type: 'string' },
                                    alt: { type: 'string' }
                                }
                            }
                        },
                        dimensions: {
                            type: 'object',
                            properties: {
                                length: { type: 'number' },
                                width: { type: 'number' },
                                height: { type: 'number' },
                                unit: { type: 'string' }
                            }
                        },
                        materials: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        colors: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive', 'out_of_stock']
                        },
                        featured: { type: 'boolean' },
                        likes: { type: 'number' },
                        views: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Review: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        tour: { type: 'string', description: 'Tour ID' },
                        user: { type: 'string', description: 'User ID' },
                        booking: { type: 'string', description: 'Booking ID' },
                        rating: { 
                            type: 'number',
                            minimum: 1,
                            maximum: 5
                        },
                        comment: { type: 'string' },
                        images: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        isVerified: { 
                            type: 'boolean',
                            description: 'Whether review is from verified booking'
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                            description: 'Validation errors',
                        },
                    },
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['./routes/*.js', './controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
