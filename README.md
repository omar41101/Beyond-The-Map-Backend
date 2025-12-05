# Beyond The Map - Backend API

Backend server for Beyond The Map - A comprehensive Web3 tourism platform with Hedera blockchain integration.

## 🚀 Quick Start

### Access Interactive API Documentation

**Swagger UI**: http://localhost:9999/api-docs

The complete API documentation is available through Swagger UI with:
- ✅ 90+ fully documented endpoints
- ✅ Interactive testing
- ✅ Authentication support
- ✅ Request/response examples
- ✅ All data schemas

For detailed guides, see:
- [Complete API Documentation](./API_DOCUMENTATION.md)
- [API Endpoints Reference](./API_ENDPOINTS.md)
- [Swagger Quick Start](./SWAGGER_GUIDE.md)
- [Swagger UI Visual Guide](./SWAGGER_UI_GUIDE.md)

## Setup

### 1. Install MongoDB
- Download: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` - Your MongoDB connection
- `JWT_SECRET` - Strong secret key
- `PORT` - Server port (default: 5000)

### 4. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Documentation

### Interactive Swagger Documentation
All 90+ endpoints are fully documented with Swagger/OpenAPI 3.0:

**Access at**: http://localhost:9999/api-docs

**Features**:
- Try endpoints directly in browser
- Authentication testing
- Request/response schemas
- Example payloads
- Error handling documentation

### Documentation Files
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete guide with use cases
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Quick endpoint reference
- [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) - How to use Swagger UI
- [SWAGGER_UI_GUIDE.md](./SWAGGER_UI_GUIDE.md) - Visual guide

### Test Credentials
Pre-seeded accounts for testing:
```
Admin:    admin@btm.com     / Admin@123
Agency:   agency1@btm.com   / Agency@123
Artist:   artist1@btm.com   / Artist@123
Tourist:  user1@btm.com     / User@123
```

## 🎯 Quick API Examples

### Register
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Profile
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Book a Tour
```bash
POST /api/bookings
Authorization: Bearer <token>
{
  "tourId": "tour_id_here",
  "bookingDate": "2024-12-15",
  "numberOfParticipants": 2,
  "paymentMethod": "fiat"
}
```

**For complete endpoint documentation, see Swagger UI or [API_ENDPOINTS.md](./API_ENDPOINTS.md)**
