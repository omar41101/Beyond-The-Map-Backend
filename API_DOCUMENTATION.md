# Beyond The Map - API Documentation

## 🌍 Overview

Beyond The Map is a comprehensive Web3 tourism platform backend API built with Node.js, Express, MongoDB, and Hedera blockchain integration.

## 📚 Interactive Documentation

**Access the full interactive API documentation at:**
```
http://localhost:9999/api-docs
```

The Swagger UI provides:
- ✅ Complete endpoint documentation
- ✅ Request/response schemas
- ✅ Try-it-out functionality
- ✅ Authentication testing
- ✅ Example payloads

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed database (optional)
npm run seed

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

### Access Points
- **API Base URL**: `http://localhost:9999/api`
- **Swagger Docs**: `http://localhost:9999/api-docs`
- **Health Check**: `http://localhost:9999/api/health`

## 🔑 Authentication

### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response includes JWT token:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Using the Token
Include the token in subsequent requests:
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 API Endpoints Overview

### Authentication & Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/link-hedera` - Link Hedera account

### Tours
- `GET /api/tours` - List all tours (with filters)
- `GET /api/tours/:id` - Get single tour
- `POST /api/tours` - Create tour (Agency only)
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour
- `GET /api/tours/agency/:agencyId` - Get agency tours
- `GET /api/tours/stats` - Tour statistics

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/payment` - Update payment status
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/fiat/initiate` - Initiate fiat payment
- `POST /api/payments/fiat/confirm` - Confirm payment
- `POST /api/payments/fiat/refund` - Process refund
- `GET /api/payments/history` - Payment history

### NFTs
- `POST /api/nfts` - Record NFT mint
- `GET /api/nfts/my-nfts` - Get user NFTs
- `GET /api/nfts/:id` - Get NFT details
- `PUT /api/nfts/:id/transfer` - Update NFT owner

### Agency Management
- `POST /api/agency/register` - Register as agency
- `GET /api/agency/profile` - Get agency profile
- `PUT /api/agency/profile` - Update profile
- `GET /api/agency/tours` - Get agency tours
- `GET /api/agency/bookings` - Get agency bookings
- `GET /api/agency/dashboard` - Dashboard stats
- `GET /api/agency/public/:id` - Public agency profile

### Artist & Products
- `POST /api/artist/register` - Register as artist
- `GET /api/artist/profile` - Get artist profile
- `PUT /api/artist/profile` - Update profile
- `POST /api/artist/products` - Create product
- `GET /api/artist/products` - List artist products
- `PUT /api/artist/products/:id` - Update product
- `DELETE /api/artist/products/:id` - Delete product
- `GET /api/products/marketplace` - Browse marketplace
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/like` - Like product
- `POST /api/products/:id/review` - Review product

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/tour/:tourId` - Get tour reviews
- `GET /api/reviews/my-reviews` - Get user reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin (Admin Only)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - User details
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/tours` - All tours
- `PUT /api/admin/tours/:id/approve` - Approve/deactivate tour
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/reviews` - All reviews
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/analytics` - Advanced analytics
- `GET /api/admin/agencies` - Agency registrations
- `PUT /api/admin/agencies/:id/approve` - Approve agency
- `GET /api/admin/artists` - Artist registrations
- `PUT /api/admin/artists/:id/approve` - Approve artist

### Tourist/User
- `GET /api/tourist/bookings` - User bookings
- `GET /api/tourist/history` - Travel history
- `GET /api/tourist/dashboard` - User dashboard
- `GET /api/tourist/nfts` - Proof of visit NFTs

## 🎯 Common Use Cases

### 1. Book a Tour (Fiat Payment)

```bash
# Step 1: Browse tours
GET /api/tours

# Step 2: Create booking
POST /api/bookings
{
  "tourId": "tour_id_here",
  "bookingDate": "2024-12-15",
  "numberOfParticipants": 2,
  "paymentMethod": "fiat",
  "email": "user@example.com",
  "customerName": "John Doe"
}

# Step 3: Initiate payment
POST /api/payments/fiat/initiate
{
  "bookingId": "booking_id_here",
  "paymentGateway": "stripe",
  "currency": "USD"
}

# Step 4: Confirm payment
POST /api/payments/fiat/confirm
{
  "bookingId": "booking_id_here",
  "transactionId": "txn_xxx",
  "paymentGateway": "stripe"
}
```

### 2. Become an Agency

```bash
# Step 1: Register as user (if not already)
POST /api/auth/register

# Step 2: Apply for agency status
POST /api/agency/register
{
  "companyName": "Morocco Adventures",
  "licenseNumber": "MA-2024-001",
  "description": "Leading tour operator",
  "address": {
    "street": "123 Main St",
    "city": "Marrakech",
    "country": "Morocco",
    "zipCode": "40000"
  },
  "contactInfo": {
    "phone": "+212-524-123456",
    "email": "info@moroccoAdventures.com",
    "website": "www.moroccoAdventures.com"
  }
}

# Step 3: Wait for admin approval
# Check status at: GET /api/agency/profile

# Step 4: Create tours (after approval)
POST /api/tours
{
  "name": "Marrakech City Tour",
  "description": "Explore the vibrant city",
  "location": "Marrakech",
  "price": 89.99,
  "duration": 1,
  "maxParticipants": 15,
  "category": "cultural"
}
```

### 3. Mint Proof of Visit NFT

```bash
# After completing a tour booking
POST /api/nfts
{
  "tokenId": "NFT-POV-001",
  "type": "proof_of_visit",
  "serialNumber": "1",
  "metadata": {
    "name": "Marrakech Visit 2024",
    "description": "Proof of visit to Marrakech",
    "image": "https://example.com/nft.jpg",
    "attributes": [
      { "trait_type": "Location", "value": "Marrakech" },
      { "trait_type": "Date", "value": "2024-12-01" }
    ]
  },
  "relatedTour": "tour_id",
  "relatedBooking": "booking_id",
  "hederaTransactionId": "0.0.123456@1234567890.123"
}
```

## 🔒 Security Features

### Rate Limiting
- Global: 100 requests per 15 minutes per IP
- Auth endpoints: 5 login attempts per 15 minutes
- Payment endpoints: 10 requests per 15 minutes

### Input Validation
- MongoDB injection prevention
- XSS sanitization
- Request payload validation
- File upload restrictions

### Security Headers
- Helmet.js security headers
- CORS configuration
- Cookie security
- HTTPS enforcement (production)

### Fraud Detection
- Suspicious payment detection
- Booking amount validation
- Rate limiting by user/IP

## 📊 Data Models

### User
```javascript
{
  email: String,
  password: String (hashed),
  fullName: String,
  phone: String,
  hederaAccountId: String,
  role: ['user', 'agency', 'artist', 'admin'],
  profileImage: String,
  createdAt: Date
}
```

### Tour
```javascript
{
  name: String,
  description: String,
  location: String,
  price: Number,
  duration: Number,
  maxParticipants: Number,
  category: ['cultural', 'adventure', 'historical', 'nature', 'culinary', 'wellness'],
  images: [String],
  agency: ObjectId,
  startDate: Date,
  endDate: Date,
  availableDates: [Date],
  isActive: Boolean,
  rating: Number,
  reviewCount: Number
}
```

### Booking
```javascript
{
  tour: ObjectId,
  user: ObjectId,
  bookingDate: Date,
  numberOfParticipants: Number,
  totalPrice: Number,
  status: ['pending', 'confirmed', 'completed', 'cancelled'],
  paymentStatus: ['pending', 'paid', 'refunded'],
  paymentMethod: ['wallet', 'hedera', 'fiat', 'cash'],
  hederaTransactionId: String,
  fiatPayment: {
    transactionId: String,
    paymentGateway: String,
    cardLast4: String,
    paymentDate: Date,
    currency: String
  },
  nftMinted: Boolean
}
```

## 🧪 Testing

### Test Credentials (from seed data)

```
Admin:
  email: admin@btm.com
  password: Admin@123

Agency:
  email: agency1@btm.com
  password: Agency@123

Artist:
  email: artist1@btm.com
  password: Artist@123

User/Tourist:
  email: user1@btm.com
  password: User@123
```

### Run Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- auth.test.js
npm test -- bookings.test.js
npm test -- payments.test.js
```

## 📝 Environment Variables

```env
# Server
PORT=9999
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/beyond-the-map

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Frontend
FRONTEND_URL=http://localhost:5173

# Hedera (optional)
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=your_private_key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🐛 Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## 📦 Database Seeding

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- ✅ 8 users (admin, agencies, artists, tourists)
- ✅ 2 approved agencies
- ✅ 2 approved artists
- ✅ 6 artisan products
- ✅ 5 tours
- ✅ 5 bookings
- ✅ 3 reviews
- ✅ 2 NFTs

## 🔄 API Versioning

Current version: **v1.0.0**

All endpoints are prefixed with `/api/`

## 📞 Support

- **Documentation**: http://localhost:9999/api-docs
- **Health Check**: http://localhost:9999/api/health
- **Issues**: GitHub repository issues

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for Beyond The Map**
