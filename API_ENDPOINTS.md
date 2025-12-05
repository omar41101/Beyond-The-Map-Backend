# Beyond The Map - API Endpoints Reference

## Quick Access
- **Swagger UI**: http://localhost:9999/api-docs
- **API Base**: http://localhost:9999/api
- **Health Check**: http://localhost:9999/api/health

---

## 🔐 Authentication & User Management

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | User login |
| GET | `/api/auth/me` | ✅ | Get current user profile |

### User Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/user/profile` | ✅ | Update user profile |
| PUT | `/api/user/link-hedera` | ✅ | Link Hedera account |

---

## 🗺️ Tours

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/tours` | ❌ | All | Get all active tours (with filters) |
| GET | `/api/tours/:id` | ❌ | All | Get single tour details |
| GET | `/api/tours/stats` | ❌ | All | Get tour statistics |
| GET | `/api/tours/status/:status` | ❌ | All | Get tours by status |
| GET | `/api/tours/agency/:agencyId` | ❌ | All | Get tours by agency |
| POST | `/api/tours` | ✅ | Agency | Create new tour |
| PUT | `/api/tours/:id` | ✅ | Agency | Update tour |
| DELETE | `/api/tours/:id` | ✅ | Agency | Delete tour |

**Query Parameters for GET /api/tours:**
- `category` - Filter by category
- `location` - Filter by location
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search term

---

## 📅 Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | ❌* | Create booking (supports fiat without auth) |
| GET | `/api/bookings/my-bookings` | ✅ | Get user's bookings |
| GET | `/api/bookings/:id` | ✅ | Get booking details |
| PUT | `/api/bookings/:id/status` | ✅ | Update booking status |
| PUT | `/api/bookings/:id/payment` | ✅ | Update payment status |
| DELETE | `/api/bookings/:id` | ✅ | Cancel booking |

*Fiat payments can be made without authentication

---

## 💳 Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payments/methods` | ❌ | Get available payment methods |
| POST | `/api/payments/fiat/initiate` | ✅ | Initiate fiat payment |
| POST | `/api/payments/fiat/confirm` | ✅ | Confirm fiat payment |
| POST | `/api/payments/fiat/refund` | ✅ | Process refund (Admin/Agency) |
| GET | `/api/payments/history` | ✅ | Get payment history |

**Supported Payment Gateways:**
- Stripe
- PayPal
- Square

---

## 🎨 NFTs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/nfts` | ✅ | Record NFT mint |
| GET | `/api/nfts/my-nfts` | ✅ | Get user's NFTs |
| GET | `/api/nfts/:id` | ✅ | Get NFT details |
| PUT | `/api/nfts/:id/transfer` | ✅ | Update NFT owner after transfer |

**NFT Types:**
- `proof_of_visit` - Proof of tour completion
- `artisanat` - Artisan product NFT
- `tour_package` - Tour package NFT

---

## 🏢 Agency Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/agency/register` | ✅ | User | Apply for agency status |
| GET | `/api/agency/profile` | ✅ | Agency | Get agency profile |
| PUT | `/api/agency/profile` | ✅ | Agency | Update agency profile |
| GET | `/api/agency/tours` | ✅ | Agency | Get agency's tours |
| GET | `/api/agency/bookings` | ✅ | Agency | Get agency's bookings |
| GET | `/api/agency/dashboard` | ✅ | Agency | Get dashboard statistics |
| GET | `/api/agency/public/:id` | ❌ | All | Get public agency profile |

**Agency Status:**
- `pending` - Awaiting admin approval
- `approved` - Active agency
- `rejected` - Application rejected
- `suspended` - Temporarily suspended

---

## 👨‍🎨 Artist & Products

### Artist Management
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/artist/register` | ✅ | User | Apply for artist status |
| GET | `/api/artist/profile` | ✅ | Artist | Get artist profile |
| PUT | `/api/artist/profile` | ✅ | Artist | Update artist profile |
| GET | `/api/artist/nfts` | ✅ | Artist | Get artist NFTs |
| GET | `/api/artist/dashboard` | ✅ | Artist | Get dashboard statistics |
| GET | `/api/artist/dashboard/stats` | ✅ | Artist | Get detailed stats |
| GET | `/api/artist/public/:id` | ❌ | All | Get public artist profile |

### Product Management (Artist)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/artist/products` | ✅ | Artist | Create new product |
| GET | `/api/artist/products` | ✅ | Artist | Get artist's products |
| GET | `/api/artist/products/:id` | ✅ | Artist | Get single product |
| PUT | `/api/artist/products/:id` | ✅ | Artist | Update product |
| DELETE | `/api/artist/products/:id` | ✅ | Artist | Delete product |

### Public Product Marketplace
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/marketplace` | ❌ | Browse all products |
| GET | `/api/products/:id` | ❌ | Get product details |
| POST | `/api/products/:id/like` | ✅ | Toggle product like |
| POST | `/api/products/:id/review` | ✅ | Add product review |

**Product Categories:**
- pottery
- textiles
- jewelry
- leather
- woodwork
- metalwork
- basketry
- painting
- other

---

## ⭐ Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | ✅ | Create review (requires completed booking) |
| GET | `/api/reviews/tour/:tourId` | ❌ | Get reviews for a tour |
| GET | `/api/reviews/my-reviews` | ✅ | Get user's reviews |
| PUT | `/api/reviews/:id` | ✅ | Update review |
| DELETE | `/api/reviews/:id` | ✅ | Delete review |

---

## 👤 Tourist/User Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tourist/bookings` | ✅ | Get tourist's bookings |
| GET | `/api/tourist/history` | ✅ | Get complete travel history |
| GET | `/api/tourist/dashboard` | ✅ | Get tourist dashboard stats |
| GET | `/api/tourist/nfts` | ✅ | Get proof of visit NFTs |

---

## 👑 Admin Endpoints (Admin Only)

### Dashboard & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get comprehensive dashboard statistics |
| GET | `/api/admin/analytics` | Get advanced analytics with date range |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (with filters) |
| GET | `/api/admin/users/:id` | Get user details |
| PUT | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

### Tour Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/tours` | Get all tours (with filters) |
| PUT | `/api/admin/tours/:id/approve` | Approve/deactivate tour |

### Booking Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/bookings` | Get all bookings (with filters) |

### Review Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reviews` | Get all reviews (with filters) |
| DELETE | `/api/admin/reviews/:id` | Delete review |

### Agency Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/agencies` | Get all agency registrations |
| PUT | `/api/admin/agencies/:id/approve` | Approve/reject agency application |

### Artist Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/artists` | Get all artist registrations |
| PUT | `/api/admin/artists/:id/approve` | Approve/reject artist application |

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🔒 Authentication

Include JWT token in requests:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📈 Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| Global | 100 requests / 15 min |
| Auth | 5 attempts / 15 min |
| Payments | 10 requests / 15 min |
| Registration | 3 attempts / hour |

---

## 🎯 Common Workflows

### 1. User Journey
```
Register → Login → Browse Tours → Book Tour → Pay → Receive NFT → Leave Review
```

### 2. Agency Journey
```
Register → Apply for Agency → Wait Approval → Create Tours → Manage Bookings
```

### 3. Artist Journey
```
Register → Apply for Artist → Wait Approval → Create Products → Manage Sales
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in USD (configurable)
- File uploads limited to 10MB
- Hedera transactions are optional but recommended
- All routes support JSON only (except file uploads)

---

**Total Endpoints: 90+**

For complete interactive documentation, visit: **http://localhost:9999/api-docs**
