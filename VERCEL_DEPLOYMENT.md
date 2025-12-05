# Vercel Deployment Guide for Backend

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Your MongoDB connection string (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
3. **Vercel CLI** (optional): `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `backend` folder as the root directory

3. **Configure Environment Variables**:
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   ```env
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-secure-random-string>
   FRONTEND_URL=<your-frontend-vercel-url>
   PORT=5000
   ```

   **Important**: Generate a secure JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your API will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd backend
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   vercel env add NODE_ENV
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/btm?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-64-char-random-string` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.vercel.app` |
| `PORT` | Server port (optional) | `5000` |

## MongoDB Atlas Setup

1. **Create Free Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster (512MB)

2. **Create Database User**:
   - Security → Database Access → Add New Database User
   - Choose password authentication
   - Grant "Read and write to any database" privileges

3. **Whitelist IP Address**:
   - Security → Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere - required for Vercel)

4. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `btm` or your preferred database name

## Post-Deployment Steps

### 1. Seed Database (Optional)
After deployment, you can seed your database:
```bash
# Install MongoDB Compass or use MongoDB Shell
# Connect to your Atlas cluster
# Run the seed script locally:
node seeders/seed.js
```

Or create a separate Node.js script to seed via API calls.

### 2. Update Frontend API URL
Update your frontend `.env` file:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

### 3. Test API Endpoints
Test your deployed API:
```bash
# Health check
curl https://your-backend.vercel.app/api/health

# API Documentation
# Visit: https://your-backend.vercel.app/api-docs
```

## Vercel Specific Configuration

### vercel.json Explained

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",          // Entry point
      "use": "@vercel/node"        // Node.js runtime
    }
  ],
  "routes": [
    {
      "src": "/(.*)",              // Match all routes
      "dest": "server.js"          // Forward to Express
    }
  ],
  "env": {
    "NODE_ENV": "production"       // Set environment
  }
}
```

## Important Notes

### ⚠️ Vercel Limitations for Backend

1. **Serverless Functions**: Vercel runs as serverless functions
   - Maximum execution time: 10s (Hobby), 60s (Pro)
   - Functions are stateless (no in-memory storage between requests)

2. **Scheduled Jobs**: 
   - The cron jobs (`scheduler.js`, `backup.js`) won't work on Vercel
   - Consider using Vercel Cron or external services like:
     - [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) (Pro plan)
     - [GitHub Actions](https://github.com/features/actions)
     - [EasyCron](https://www.easycron.com/)

3. **File Storage**:
   - Vercel filesystem is read-only except `/tmp`
   - Use cloud storage for uploads (AWS S3, Cloudinary, etc.)

4. **Database Backups**:
   - Use MongoDB Atlas automated backups instead
   - Atlas has built-in backup features

### 🔧 Code Adjustments for Vercel

The backend is already configured for Vercel:
- Express app exported as default
- No server.listen() in production mode
- Environment variables from Vercel

### 🔒 Security Checklist

- ✅ Use strong JWT_SECRET (min 64 characters)
- ✅ Set CORS to specific frontend URL (not *)
- ✅ Use MongoDB Atlas with authentication
- ✅ Enable MongoDB Atlas IP whitelist
- ✅ Never commit `.env` files
- ✅ Use environment variables in Vercel

## Troubleshooting

### Issue: 500 Internal Server Error
**Solution**: Check Vercel logs
```bash
vercel logs <deployment-url>
```

### Issue: CORS Errors
**Solution**: Ensure `FRONTEND_URL` matches your frontend domain exactly
```env
FRONTEND_URL=https://your-frontend.vercel.app
```

### Issue: MongoDB Connection Failed
**Solution**: 
1. Check connection string format
2. Verify database user credentials
3. Ensure IP whitelist includes `0.0.0.0/0`

### Issue: JWT Authentication Fails
**Solution**: Ensure `JWT_SECRET` is set in Vercel environment variables

## Monitoring

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### Analytics
- Dashboard → Your Project → Analytics
- Monitor function execution time
- Track error rates

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatic

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] JWT_SECRET generated (64+ characters)
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] API health check passed
- [ ] Frontend updated with API URL
- [ ] Database seeded (if needed)
- [ ] API endpoints tested

---

**Ready to deploy?** Start with Option 1 (Vercel Dashboard) for the easiest experience! 🚀
