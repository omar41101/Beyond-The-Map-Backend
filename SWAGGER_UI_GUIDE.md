# 📸 Swagger UI Visual Guide

## What You'll See

When you open http://localhost:9999/api-docs, you'll see:

```
╔═══════════════════════════════════════════════════════════╗
║                Beyond The Map API Docs                    ║
║                                                           ║
║   [Authorize] 🔓                        [Explore] 🔍      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   Beyond The Map - Complete API Documentation             ║
║   ------------------------------------------------        ║
║   A comprehensive Web3 tourism platform backend API       ║
║   built on Hedera blockchain integration.                ║
║                                                           ║
║   Version: 1.0.0                                         ║
║   Base URL: http://localhost:9999                        ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   📋 Tags (Click to expand/collapse)                     ║
║                                                           ║
║   🔐 Authentication                               [▼]     ║
║      POST   /api/auth/register                           ║
║      POST   /api/auth/login                              ║
║      GET    /api/auth/me                                 ║
║                                                           ║
║   🗺️  Tours                                        [▼]     ║
║      GET    /api/tours                                   ║
║      GET    /api/tours/{id}                              ║
║      POST   /api/tours                                   ║
║      PUT    /api/tours/{id}                              ║
║      DELETE /api/tours/{id}                              ║
║      GET    /api/tours/stats                             ║
║      GET    /api/tours/status/{status}                   ║
║      GET    /api/tours/agency/{agencyId}                 ║
║                                                           ║
║   📅 Bookings                                     [▼]     ║
║      POST   /api/bookings                                ║
║      GET    /api/bookings/my-bookings                    ║
║      GET    /api/bookings/{id}                           ║
║      PUT    /api/bookings/{id}/status                    ║
║      PUT    /api/bookings/{id}/payment                   ║
║      DELETE /api/bookings/{id}                           ║
║                                                           ║
║   💳 Payments                                     [▼]     ║
║   🎨 NFTs                                         [▼]     ║
║   🏢 Agency                                       [▼]     ║
║   👨‍🎨 Artist                                       [▼]     ║
║   🛍️  Products                                     [▼]     ║
║   ⭐ Reviews                                      [▼]     ║
║   👤 Tourist                                      [▼]     ║
║   👑 Admin                                        [▼]     ║
║   📱 User                                         [▼]     ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║   📖 Schemas                                              ║
║      ▼ User                                               ║
║      ▼ Tour                                               ║
║      ▼ Booking                                            ║
║      ▼ NFT                                                ║
║      ▼ Agency                                             ║
║      ▼ Artist                                             ║
║      ▼ Product                                            ║
║      ▼ Review                                             ║
║      ▼ Error                                              ║
╚═══════════════════════════════════════════════════════════╝
```

## Expanded Endpoint View

When you click on an endpoint (e.g., POST /api/auth/login):

```
╔═══════════════════════════════════════════════════════════╗
║  POST  /api/auth/login                                    ║
║  Login user                                               ║
║                                                           ║
║  [Try it out]  [Cancel]                                   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Parameters                                               ║
║  No parameters                                            ║
║                                                           ║
║  Request body                          [required] *       ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ {                                                   │ ║
║  │   "email": "user@example.com",                     │ ║
║  │   "password": "password123"                        │ ║
║  │ }                                                   │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [Execute]                                                ║
║                                                           ║
║  Responses                                                ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ Code: 200 - Login successful                       │ ║
║  │ {                                                   │ ║
║  │   "success": true,                                 │ ║
║  │   "token": "eyJhbGc...",                          │ ║
║  │   "user": { ... }                                  │ ║
║  │ }                                                   │ ║
║  │                                                     │ ║
║  │ Code: 401 - Invalid credentials                    │ ║
║  │ {                                                   │ ║
║  │   "success": false,                                │ ║
║  │   "message": "Invalid email or password"           │ ║
║  │ }                                                   │ ║
║  └─────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════╝
```

## After Clicking "Try it out"

```
╔═══════════════════════════════════════════════════════════╗
║  POST  /api/auth/login                                    ║
║  Login user                                               ║
║                                                           ║
║  [Try it out]  [Cancel]                                   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Request body                          [required] *       ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ {                                                   │ ║
║  │   "email": "█",                    ← editable       │ ║
║  │   "password": "█"                                   │ ║
║  │ }                                                   │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [Execute]  ← Click to send request                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## After Clicking "Execute"

```
╔═══════════════════════════════════════════════════════════╗
║  Server response                                          ║
║                                                           ║
║  Code: 200                                                ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ {                                                   │ ║
║  │   "success": true,                                 │ ║
║  │   "message": "Login successful",                   │ ║
║  │   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...", │ ║
║  │   "user": {                                        │ ║
║  │     "_id": "507f1f77bcf86cd799439011",            │ ║
║  │     "email": "user1@btm.com",                      │ ║
║  │     "fullName": "John Doe",                        │ ║
║  │     "role": "user",                                │ ║
║  │     "createdAt": "2024-12-01T10:00:00.000Z"       │ ║
║  │   }                                                 │ ║
║  │ }                                                   │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  Response headers                                         ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ content-type: application/json; charset=utf-8      │ ║
║  │ content-length: 245                                │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  Curl                                                     ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ curl -X POST "http://localhost:9999/api/auth/login"│ ║
║  │      -H "Content-Type: application/json"           │ ║
║  │      -d '{"email":"user1@btm.com", ...}'          │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  Request URL                                              ║
║  http://localhost:9999/api/auth/login                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Authorization Dialog

When you click "Authorize" button:

```
╔═══════════════════════════════════════════════════════════╗
║  Available authorizations                                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  bearerAuth  (http, Bearer)                              ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ Value:                                              │ ║
║  │ ┌───────────────────────────────────────────────┐  │ ║
║  │ │ Bearer eyJhbGc...                             │  │ ║
║  │ └───────────────────────────────────────────────┘  │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [Authorize]  [Close]                                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Schema View

When you click on a schema (e.g., "Tour"):

```
╔═══════════════════════════════════════════════════════════╗
║  Tour                                                     ║
╠═══════════════════════════════════════════════════════════╣
║  {                                                        ║
║    _id: string                                           ║
║    name: string                                          ║
║    description: string                                   ║
║    location: string                                      ║
║    price: number                                         ║
║    duration: number (Duration in days)                   ║
║    maxParticipants: number                               ║
║    category: string                                      ║
║      Enum: [ cultural, adventure, historical, nature,    ║
║             culinary, wellness ]                         ║
║    images: [string]                                      ║
║    agency: string (Agency ID)                            ║
║    startDate: string($date-time)                         ║
║    endDate: string($date-time)                           ║
║    availableDates: [string($date-time)]                  ║
║    isActive: boolean                                     ║
║    rating: number                                        ║
║    reviewCount: number                                   ║
║    createdAt: string($date-time)                         ║
║  }                                                        ║
╚═══════════════════════════════════════════════════════════╝
```

## Features Visible in UI

### 🎨 Visual Elements

1. **Color Coding**
   - 🟢 GET requests (green)
   - 🟡 POST requests (yellow/orange)
   - 🔵 PUT requests (blue)
   - 🔴 DELETE requests (red)

2. **Icons & Badges**
   - 🔒 Lock icon for authenticated endpoints
   - ⚠️ Warning for deprecated endpoints
   - ✅ Success status codes
   - ❌ Error status codes

3. **Interactive Elements**
   - Expandable/collapsible sections
   - Editable request bodies
   - Copy buttons for curl commands
   - Download buttons for responses

### 📋 Information Display

Each endpoint shows:
- ✅ HTTP method and path
- ✅ Summary description
- ✅ Parameters (path, query, header, body)
- ✅ Request body schema
- ✅ Response schemas (all status codes)
- ✅ Example values
- ✅ Authentication requirements
- ✅ Generated curl command
- ✅ Request URL

### 🔍 Search & Filter

- Search bar at top
- Filter by tag
- Filter by method (GET, POST, etc.)
- Filter by authentication requirement

### 📊 Additional Panels

1. **Servers Panel**
   - Development: http://localhost:9999
   - Production: https://api.beyondthemap.com

2. **Info Panel**
   - API version
   - Contact information
   - License
   - Description

3. **Schemas Panel**
   - All data models
   - Field types
   - Validation rules
   - Nested structures

## 🎯 User Flow Example

```
1. Open Swagger UI
   ↓
2. Find "Authentication" tag
   ↓
3. Expand POST /api/auth/login
   ↓
4. Click "Try it out"
   ↓
5. Enter email and password
   ↓
6. Click "Execute"
   ↓
7. Copy token from response
   ↓
8. Click "Authorize" button (top right)
   ↓
9. Paste "Bearer {token}"
   ↓
10. Click "Authorize"
    ↓
11. Now test any protected endpoint!
```

## 💡 Quick Tips

- **Dark Mode**: Some browsers support dark mode
- **Keyboard Shortcuts**: Tab through fields, Enter to execute
- **Copy Responses**: Click response to auto-select for copying
- **Export**: Right-click → "Save as" on curl commands
- **Mobile**: Responsive design works on mobile devices

---

**Your Swagger UI is fully interactive and ready to use!** 🚀

Just start the server and navigate to: **http://localhost:9999/api-docs**
