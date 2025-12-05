# 📚 Beyond The Map - Backend Documentation Index

## 🎯 Quick Navigation

### 🚀 Getting Started
1. [README.md](./README.md) - Main setup and quick start guide
2. [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) - How to access and use Swagger UI
3. [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Database setup instructions

### 📖 API Documentation
1. **[🌐 Swagger UI](http://localhost:9999/api-docs)** ⭐ **START HERE** ⭐
   - Interactive API explorer
   - Test all endpoints
   - View schemas and examples

2. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API guide
   - Feature overview
   - Authentication flow
   - Common use cases
   - Security features
   - Data models

3. [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Quick reference
   - All 90+ endpoints listed
   - Method, auth, role for each
   - Response formats
   - Query parameters

4. [SWAGGER_UI_GUIDE.md](./SWAGGER_UI_GUIDE.md) - Visual guide
   - Screenshots and layouts
   - Step-by-step walkthroughs
   - UI feature explanations

5. [SWAGGER_IMPLEMENTATION.md](./SWAGGER_IMPLEMENTATION.md) - Technical details
   - Implementation summary
   - Coverage statistics
   - Schema documentation

### 🔒 Security
1. [SECURITY.md](./SECURITY.md) - Security features and best practices
2. Security middleware documentation in code

### 🧪 Testing
1. [TESTING.md](./TESTING.md) - Testing guide
2. [tests/](./tests/) - Test suites
   - auth.test.js
   - bookings.test.js
   - payments.test.js
   - tours.test.js

### 🏗️ Project Structure

```
backend/
├── 📚 Documentation
│   ├── README.md                      ⭐ Start here
│   ├── API_DOCUMENTATION.md           📖 Complete API guide
│   ├── API_ENDPOINTS.md               📋 Endpoint reference
│   ├── SWAGGER_GUIDE.md               🚀 Swagger quick start
│   ├── SWAGGER_UI_GUIDE.md            📸 Visual guide
│   ├── SWAGGER_IMPLEMENTATION.md      ✅ Implementation details
│   ├── MONGODB_SETUP.md               💾 Database setup
│   ├── SECURITY.md                    🔒 Security guide
│   └── TESTING.md                     🧪 Testing guide
│
├── 🔧 Configuration
│   ├── config/
│   │   ├── database.js                MongoDB connection
│   │   └── swagger.js                 ⭐ Swagger/OpenAPI config
│   ├── .env.example                   Environment template
│   └── package.json                   Dependencies
│
├── 🛣️ API Routes (All Swagger documented)
│   └── routes/
│       ├── auth.js                    Authentication (3 endpoints)
│       ├── user.js                    User profile (2 endpoints)
│       ├── tours.js                   Tour management (9 endpoints)
│       ├── bookings.js                Booking management (6 endpoints)
│       ├── payments.js                Payment processing (5 endpoints)
│       ├── nfts.js                    NFT operations (4 endpoints)
│       ├── agency.js                  Agency management (7 endpoints)
│       ├── artist.js                  Artist management (6 endpoints)
│       ├── publicProducts.js          Product marketplace (7 endpoints)
│       ├── reviews.js                 Review management (5 endpoints)
│       ├── tourist.js                 Tourist dashboard (4 endpoints)
│       └── admin.js                   Admin panel (17 endpoints)
│
├── 🎮 Controllers
│   └── controllers/
│       ├── authController.js
│       ├── userController.js
│       ├── tourController.js
│       ├── bookingController.js
│       ├── paymentController.js
│       ├── nftController.js
│       ├── agencyController.js
│       ├── artistController.js
│       ├── productController.js
│       ├── reviewController.js
│       ├── touristController.js
│       └── adminController.js
│
├── 💾 Data Models
│   └── models/
│       ├── User.js                    User schema
│       ├── Tour.js                    Tour schema
│       ├── Booking.js                 Booking schema
│       ├── NFT.js                     NFT schema
│       ├── Agency.js                  Agency schema
│       ├── Artist.js                  Artist schema
│       ├── Product.js                 Product schema
│       ├── Review.js                  Review schema
│       └── AuditLog.js                Audit log schema
│
├── 🛡️ Middleware
│   └── middleware/
│       ├── auth.js                    JWT authentication
│       ├── roleCheck.js               Role-based access
│       ├── rateLimiter.js             Rate limiting
│       ├── validation.js              Input validation
│       ├── fraudDetection.js          Fraud prevention
│       ├── securityHeaders.js         Security headers
│       └── inputSanitization.js       XSS/injection prevention
│
├── 🧪 Tests
│   └── tests/
│       ├── auth.test.js
│       ├── bookings.test.js
│       ├── payments.test.js
│       └── tours.test.js
│
├── 🌱 Database Seeding
│   └── seeders/
│       └── seed.js                    Sample data
│
└── 🔧 Utilities
    └── utils/
        ├── auditLogger.js
        ├── emailService.js
        ├── scheduler.js
        └── backup.js
```

## 📊 API Coverage

| Category | Endpoints | Swagger Docs | Status |
|----------|-----------|--------------|--------|
| Authentication | 3 | ✅ Complete | Ready |
| User Management | 2 | ✅ Complete | Ready |
| Tours | 9 | ✅ Complete | Ready |
| Bookings | 6 | ✅ Complete | Ready |
| Payments | 5 | ✅ Complete | Ready |
| NFTs | 4 | ✅ Complete | Ready |
| Agency | 7 | ✅ Complete | Ready |
| Artist | 6 | ✅ Complete | Ready |
| Products | 7 | ✅ Complete | Ready |
| Reviews | 5 | ✅ Complete | Ready |
| Tourist | 4 | ✅ Complete | Ready |
| Admin | 17 | ✅ Complete | Ready |
| **TOTAL** | **90+** | **100%** | **✅ Ready** |

## 🎓 Learning Path

### For New Developers
1. Read [README.md](./README.md) for setup
2. Run `npm run seed` to populate database
3. Open [Swagger UI](http://localhost:9999/api-docs)
4. Test endpoints with provided credentials
5. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for details

### For Frontend Developers
1. Open [Swagger UI](http://localhost:9999/api-docs) for live docs
2. Check [API_ENDPOINTS.md](./API_ENDPOINTS.md) for quick reference
3. Use test credentials to explore
4. Export OpenAPI spec for code generation

### For DevOps/Deployment
1. Review [SECURITY.md](./SECURITY.md)
2. Check environment variables in [.env.example](./.env.example)
3. Review [MONGODB_SETUP.md](./MONGODB_SETUP.md)
4. Configure rate limiting and security headers

### For Testing
1. Read [TESTING.md](./TESTING.md)
2. Review test files in [tests/](./tests/)
3. Use Swagger UI for manual testing
4. Run `npm test` for automated tests

## 🔗 Quick Links

### Documentation
- **[Swagger UI](http://localhost:9999/api-docs)** - Interactive API docs ⭐
- **[API JSON](http://localhost:9999/api-docs.json)** - OpenAPI specification
- **[Health Check](http://localhost:9999/api/health)** - Server status

### External Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [JWT.io](https://jwt.io/) - JWT debugger

## 🎯 Common Tasks

### Starting the Server
```bash
cd backend
npm install
npm run dev
```

### Accessing Documentation
```bash
# Open browser to:
http://localhost:9999/api-docs
```

### Testing an Endpoint
1. Open Swagger UI
2. Find endpoint (e.g., POST /api/auth/login)
3. Click "Try it out"
4. Enter test credentials
5. Click "Execute"

### Seeding Database
```bash
npm run seed
```

### Running Tests
```bash
npm test
```

## 📝 Test Credentials

All test accounts (from seed data):

```
Admin Account:
  Email: admin@btm.com
  Password: Admin@123
  Role: admin

Agency Account:
  Email: agency1@btm.com
  Password: Agency@123
  Role: agency
  Status: approved

Artist Account:
  Email: artist1@btm.com
  Password: Artist@123
  Role: artist
  Status: approved

Tourist/User Account:
  Email: user1@btm.com
  Password: User@123
  Role: user
```

## 🆘 Getting Help

### Common Issues

**Can't access Swagger UI?**
- Ensure server is running: `npm run dev`
- Check http://localhost:9999/api/health
- Verify PORT in .env (default: 9999)

**Authentication errors?**
- Get fresh token from /api/auth/login
- Click "Authorize" in Swagger UI
- Enter: `Bearer YOUR_TOKEN`

**Database connection issues?**
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

**Need more help?**
- Check [TESTING.md](./TESTING.md) for troubleshooting
- Review [SECURITY.md](./SECURITY.md) for security issues
- Check specific controller code for implementation details

## 🎉 What's Documented

✅ **All 90+ API endpoints** with Swagger annotations
✅ **Complete request/response schemas** for all data types
✅ **Authentication flows** with JWT
✅ **Error handling** with examples
✅ **Role-based access control** documentation
✅ **Payment processing** workflows
✅ **NFT operations** on Hedera
✅ **File upload** specifications
✅ **Rate limiting** rules
✅ **Security features** and best practices

## 📈 Next Steps

1. ✅ **Start the server**: `npm run dev`
2. ✅ **Open Swagger UI**: http://localhost:9999/api-docs
3. ✅ **Login with test account** to get token
4. ✅ **Authorize in Swagger** with the token
5. ✅ **Test endpoints** interactively
6. ✅ **Explore documentation** files for details

---

## 🌟 Pro Tips

- Bookmark the Swagger UI for quick access
- Use Swagger's "Authorize" feature once for all requests
- Export OpenAPI JSON for Postman or other tools
- Check Schemas section for all data models
- Use curl commands generated by Swagger for automation

---

**All backend API endpoints are now fully documented! 🎊**

**Start exploring at: http://localhost:9999/api-docs**
