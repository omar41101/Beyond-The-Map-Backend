# MongoDB Setup Guide

## Problem
MongoDB service is installed but not running. The backend cannot connect to the database.

## Solutions

### Option 1: Start Local MongoDB (Recommended for Development)

**Windows:**
1. Open PowerShell or Command Prompt **as Administrator**
2. Run: `Start-Service -Name MongoDB`
   OR: `net start MongoDB`
3. Verify: `Get-Service -Name MongoDB`

**Alternative (Manual Start):**
1. Navigate to MongoDB installation folder (usually `C:\Program Files\MongoDB\Server\7.0\bin\`)
2. Run: `mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"`

### Option 2: Use MongoDB Atlas (Cloud - Free Tier)

MongoDB Atlas provides a free cloud database that's easier to set up:

**Steps:**
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Create a database user with password
5. Whitelist your IP address (or allow access from anywhere: 0.0.0.0/0)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyond-the-map`)
7. Update `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/beyond-the-map?retryWrites=true&w=majority
```

### Option 3: Use Docker (Cross-Platform)

**If you have Docker installed:**

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name btm-mongo mongo

# Verify it's running
docker ps
```

Your existing `.env` will work without changes.

## Current Configuration

**File**: `backend/.env`
```env
MONGODB_URI=mongodb://localhost:27017/beyond-the-map
```

This expects MongoDB running locally on port 27017.

## Verification

After starting MongoDB, verify the connection:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
```

## Seed the Database

Once MongoDB is running, seed it with test data:

```bash
cd backend
npm run seed
```

This will create:
- Test users (admin, agencies, artists, users)
- Sample tours
- Sample bookings
- Sample reviews
- Sample NFTs

## Test Accounts (After Seeding)

```
Admin: admin@btm.com / Admin@123
Agency: agency1@btm.com / Agency@123
Artist: artist1@btm.com / Artist@123
User: user1@btm.com / User@123
```

## Troubleshooting

**"Access is denied" error:**
- Run PowerShell/CMD as Administrator

**MongoDB service doesn't exist:**
- Reinstall MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Choose "Install MongoDB as a Service" during installation

**Connection timeout:**
- Check if MongoDB is running: `Get-Service MongoDB`
- Check if port 27017 is in use: `netstat -ano | findstr :27017`

**Firewall blocking:**
- Add exception for MongoDB in Windows Firewall
- Or temporarily disable firewall for testing

## Recommended Setup (Production)

For production deployment:
1. Use MongoDB Atlas or managed database service
2. Enable authentication
3. Use strong passwords
4. Whitelist only necessary IP addresses
5. Enable SSL/TLS
6. Regular backups

## Quick Start (Choose One)

**Local MongoDB:**
```powershell
# As Administrator
Start-Service MongoDB

# Then
cd backend
npm run seed
npm run dev
```

**MongoDB Atlas:**
```bash
# Update .env with Atlas connection string
# Then
cd backend
npm run seed
npm run dev
```

**Docker:**
```bash
docker run -d -p 27017:27017 --name btm-mongo mongo
cd backend
npm run seed
npm run dev
```
