# Testing & Seeding Guide

## Database Seeding

### Seed the Database

Populate your database with sample data for development and testing:

```bash
cd backend
npm run seed
```

This will create:
- **8 Users** (1 admin, 2 agencies, 2 artists, 3 tourists)
- **2 Agencies** (approved)
- **2 Artists** (approved)
- **5 Tours** (various categories and locations)
- **5 Bookings** (different payment methods and statuses)
- **3 Reviews** (verified reviews)
- **2 NFTs** (proof of visit and artisanat)

### Test Credentials

After seeding, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@btm.com | Admin@123 |
| Agency 1 | agency1@btm.com | Agency@123 |
| Agency 2 | agency2@btm.com | Agency@123 |
| Artist 1 | artist1@btm.com | Artist@123 |
| Artist 2 | artist2@btm.com | Artist@123 |
| Tourist 1 | user1@btm.com | User@123 |
| Tourist 2 | user2@btm.com | User@123 |
| Tourist 3 | user3@btm.com | User@123 |

## Running Tests

### Install Test Dependencies

```bash
npm install --save-dev mocha chai supertest
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

The test suite includes:

#### 1. Authentication Tests (`tests/auth.test.js`)
- ✅ User registration with validation
- ✅ Password strength requirements
- ✅ Duplicate email prevention
- ✅ User login with JWT tokens
- ✅ Invalid credentials handling
- ✅ Protected route access
- ✅ Token verification

#### 2. Tours Tests (`tests/tours.test.js`)
- ✅ Tour creation by agencies
- ✅ Authorization checks (agency-only)
- ✅ Get all tours with filters
- ✅ Filter by category, price, location
- ✅ Search functionality
- ✅ Get single tour by ID
- ✅ Update tour (owner only)
- ✅ Delete tour (soft delete)
- ✅ Tour statistics

#### 3. Bookings Tests (`tests/bookings.test.js`)
- ✅ Create booking with price calculation
- ✅ Authentication requirement
- ✅ Inactive tour rejection
- ✅ Get user's bookings
- ✅ Update payment status (fiat & Hedera)
- ✅ Auto-confirm on payment
- ✅ Cancel booking

#### 4. Payments Tests (`tests/payments.test.js`)
- ✅ Get available payment methods
- ✅ Initiate fiat payment
- ✅ Already paid booking prevention
- ✅ Confirm fiat payment
- ✅ Authorization checks
- ✅ Payment history retrieval

### Test Environment

Tests use a separate test database configured in `.env.test`:
- Database: `beyond-the-map-test`
- Automatic cleanup after tests
- Isolated from development data

## Sample Data Overview

### Tours Created
1. **Marrakech Medina Discovery** - Cultural tour, $89.99, 1 day
2. **Sahara Desert Adventure** - Adventure tour, $299.99, 3 days
3. **Fez Historical Tour** - Historical tour, $79.99, 1 day
4. **Atlas Mountains Trekking** - Nature tour, $199.99, 2 days
5. **Chefchaouen Blue City Tour** - Cultural tour, $69.99, 1 day

### Bookings Created
- Tourist 1: 2 bookings (Marrakech & Sahara)
- Tourist 2: 2 bookings (Fez & Chefchaouen)
- Tourist 3: 1 pending booking (Atlas Mountains)

### Payment Methods Used
- Fiat payments (Stripe, PayPal)
- Hedera cryptocurrency
- Cash on tour

## Manual Testing with Swagger

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open Swagger UI:
   ```
   http://localhost:9999/api-docs
   ```

3. Test Authentication Flow:
   - Register a new user or use seeded credentials
   - Copy the JWT token from response
   - Click "Authorize" button in Swagger
   - Enter: `Bearer YOUR_TOKEN`
   - Test protected endpoints

4. Test Booking Flow:
   - Login as tourist
   - Browse tours (GET /api/tours)
   - Create booking (POST /api/bookings)
   - Initiate payment (POST /api/payments/fiat/initiate)
   - Confirm payment (POST /api/payments/fiat/confirm)
   - Verify booking status

5. Test Admin Functions:
   - Login as admin
   - View dashboard (GET /api/admin/dashboard)
   - Manage agencies (GET /api/admin/agencies)
   - Approve/reject registrations

## Testing Best Practices

### Before Testing
1. Ensure MongoDB is running
2. Create `.env.test` file
3. Install test dependencies
4. Seed the database for manual testing

### During Testing
1. Use meaningful test descriptions
2. Test both success and failure cases
3. Verify authorization checks
4. Check data validation
5. Test edge cases

### After Testing
1. Review test coverage
2. Check for memory leaks
3. Verify database cleanup
4. Update test documentation

## Continuous Testing

### Pre-commit Testing
Add to your workflow:
```bash
npm test && git commit
```

### CI/CD Integration
Example GitHub Actions workflow:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install MongoDB
        run: |
          sudo apt-get install mongodb
          sudo systemctl start mongodb
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
sudo systemctl start mongodb

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### Port Already in Use
```bash
# Kill process on port 9999
npx kill-port 9999
```

### Test Timeout Errors
Increase timeout in `tests/setup.js`:
```javascript
this.timeout(20000); // 20 seconds
```

### Clear Test Database
```bash
mongosh beyond-the-map-test --eval "db.dropDatabase()"
```

## Next Steps

1. Add integration tests for complex workflows
2. Implement E2E tests with Cypress
3. Add performance testing with Artillery
4. Set up code coverage reporting with NYC/Istanbul
5. Implement visual regression testing

---

**Happy Testing! 🧪**
