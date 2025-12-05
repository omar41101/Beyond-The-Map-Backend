# 🚀 Quick Start - Swagger API Documentation

## Access Interactive API Documentation

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The server will start on **http://localhost:9999**

### 2. Open Swagger UI

Navigate to: **http://localhost:9999/api-docs**

You should see the interactive Swagger documentation interface.

## 🎯 Using Swagger UI

### Testing Endpoints Without Authentication

1. Click on any endpoint (e.g., `GET /api/tours`)
2. Click **"Try it out"**
3. Modify parameters if needed
4. Click **"Execute"**
5. View the response below

### Testing Authenticated Endpoints

1. **First, get a token:**
   - Expand `POST /api/auth/login`
   - Click "Try it out"
   - Enter credentials:
     ```json
     {
       "email": "user1@btm.com",
       "password": "User@123"
     }
     ```
   - Click "Execute"
   - Copy the `token` from the response

2. **Authorize Swagger:**
   - Click the **"Authorize"** button at the top
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"
   - Click "Close"

3. **Now you can test protected endpoints:**
   - All authenticated endpoints will include your token
   - Try `GET /api/auth/me` to verify it works

## 📚 Swagger Features

### ✅ What You Can Do

- **Browse all endpoints** - See complete API structure
- **View request/response schemas** - Understand data formats
- **Test endpoints live** - Execute real API calls
- **See example payloads** - Get sample request bodies
- **View error responses** - Understand error handling
- **Filter by tags** - Group endpoints by feature

### 🏷️ Available Tags

- **Authentication** - Login, register, user management
- **Tours** - Tour browsing and management
- **Bookings** - Booking creation and management
- **Payments** - Payment processing
- **NFTs** - NFT minting and transfers
- **Agency** - Agency registration and management
- **Artist** - Artist and product management
- **Products** - Public product marketplace
- **Reviews** - Review management
- **Admin** - Admin-only endpoints
- **Tourist** - Tourist dashboard and history
- **User** - User profile management

## 🔑 Test Accounts

Use these pre-seeded accounts:

```
Admin:
  Email: admin@btm.com
  Password: Admin@123

Agency:
  Email: agency1@btm.com
  Password: Agency@123

Artist:
  Email: artist1@btm.com
  Password: Artist@123

Tourist/User:
  Email: user1@btm.com
  Password: User@123
```

## 📋 Common Test Scenarios

### Scenario 1: Book a Tour

1. Browse tours: `GET /api/tours`
2. Create booking: `POST /api/bookings` (login first)
3. Initiate payment: `POST /api/payments/fiat/initiate`
4. Confirm payment: `POST /api/payments/fiat/confirm`

### Scenario 2: Create a Product (Artist)

1. Login as artist
2. Authorize in Swagger
3. Create product: `POST /api/artist/products`
4. View in marketplace: `GET /api/products/marketplace`

### Scenario 3: Approve an Agency (Admin)

1. Login as admin
2. Authorize in Swagger
3. Get pending agencies: `GET /api/admin/agencies?status=pending`
4. Approve agency: `PUT /api/admin/agencies/:id/approve`

## 🛠️ Troubleshooting

### Swagger UI Not Loading

```bash
# Check if server is running
curl http://localhost:9999/api/health

# Should return: {"status":"OK","message":"Backend is running"}
```

### 401 Unauthorized Errors

- Make sure you clicked "Authorize" in Swagger UI
- Verify your token is still valid (tokens expire after 30 days)
- Try logging in again to get a fresh token

### CORS Errors

- Swagger UI is served from the same domain, so no CORS issues
- If testing from external tool, ensure FRONTEND_URL is configured

### Can't Find Endpoint

- Use the search bar in Swagger UI
- Check the tag filters
- Verify you're on the correct Swagger docs URL

## 📖 Additional Resources

- **Complete API Documentation**: `backend/API_DOCUMENTATION.md`
- **Endpoint Reference**: `backend/API_ENDPOINTS.md`
- **API JSON Schema**: http://localhost:9999/api-docs.json

## 🎨 Swagger UI Customization

The Swagger UI has been customized with:
- ✅ Clean interface (top bar hidden)
- ✅ Explorer enabled
- ✅ Custom site title: "Beyond The Map API Docs"
- ✅ All schemas included
- ✅ Bearer token authentication

## 💡 Pro Tips

1. **Use the "Schemas" section** at the bottom to see all data models
2. **Click on schema names** in responses to see full structure
3. **Use the "Authorize" button once** instead of copying token for each request
4. **Export API spec** from http://localhost:9999/api-docs.json for Postman
5. **Filter by tags** to focus on specific features
6. **Use "Try it out"** to test immediately without Postman

## 🚦 Next Steps

1. ✅ Start the server
2. ✅ Open Swagger UI
3. ✅ Login to get a token
4. ✅ Authorize in Swagger
5. ✅ Test your first endpoint
6. ✅ Explore the complete API

---

**Happy Testing! 🎉**

For questions or issues, refer to the main documentation or create an issue.
