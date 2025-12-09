# Docker Deployment Guide

## Prerequisites
- Docker installed on your machine
- Docker Compose installed
- MongoDB Atlas account (or local MongoDB)

## Local Development with Docker

### 1. Build the Docker image
```bash
docker build -t beyond-the-map-backend .
```

### 2. Run with Docker Compose
```bash
docker-compose up -d
```

### 3. Stop the container
```bash
docker-compose down
```

## Production Deployment Options

### Option 1: Deploy to Railway (Recommended)

Railway supports Docker deployments automatically:

1. **Sign up at Railway.app**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Railway project**
   ```bash
   railway init
   ```

3. **Add environment variables**
   - Go to your Railway dashboard
   - Click on your project → Variables
   - Add all your .env variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `FRONTEND_URL` (your Vercel URL)

4. **Deploy**
   ```bash
   railway up
   ```

Railway will automatically detect your Dockerfile and deploy it.

### Option 2: Deploy to Render

1. **Sign up at Render.com**

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select "Docker" as environment
   - Render will auto-detect your Dockerfile

3. **Configure Environment Variables**
   - Add your MongoDB URI
   - Add JWT_SECRET
   - Add FRONTEND_URL (your Vercel URL)

4. **Deploy**
   - Render will automatically build and deploy

### Option 3: Deploy to DigitalOcean App Platform

1. **Sign up at DigitalOcean**

2. **Create New App**
   - Connect your GitHub repository
   - Choose "Dockerfile" as build method

3. **Configure**
   - Set environment variables
   - Choose your plan ($5/month minimum)

4. **Deploy**

### Option 4: Deploy to Fly.io

1. **Install flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and launch**
   ```bash
   fly auth login
   fly launch
   ```

3. **Set secrets**
   ```bash
   fly secrets set MONGODB_URI="your-mongodb-uri"
   fly secrets set JWT_SECRET="your-jwt-secret"
   fly secrets set FRONTEND_URL="https://your-vercel-app.vercel.app"
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

## Connect Frontend to Dockerized Backend

### Update your Vercel frontend environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Update `VITE_API_URL` to your deployed backend URL:
   - Railway: `https://your-app.railway.app`
   - Render: `https://your-app.onrender.com`
   - DigitalOcean: `https://your-app.ondigitalocean.app`
   - Fly.io: `https://your-app.fly.dev`

3. Redeploy your frontend:
   ```bash
   git push origin main
   ```

## Environment Variables Checklist

Make sure these are set in your Docker deployment:

- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens
- ✅ `FRONTEND_URL` - Your Vercel frontend URL
- ✅ `NODE_ENV` - Set to "production"
- ✅ `PORT` - Set to 5000 (or your preferred port)

## Verify Deployment

Test your backend is running:
```bash
curl https://your-backend-url/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Backend is healthy"
}
```

## Troubleshooting

### Container won't start
- Check logs: `docker logs <container-id>`
- Verify environment variables are set
- Ensure MongoDB URI is accessible from the container

### CORS errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL
- Check that your Vercel frontend has the correct backend URL

### Database connection issues
- Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Or whitelist your deployment platform's IP range

## Cost Comparison

- **Railway**: $5/month for 500 hours, includes $5 free credit
- **Render**: Free tier available (sleeps after inactivity), $7/month for always-on
- **Fly.io**: Free tier includes 3 shared VMs, $1.94/month for dedicated
- **DigitalOcean**: $5/month minimum

## Recommended Setup

For production with Vercel frontend:
1. ✅ Backend on Railway (easiest Docker deployment)
2. ✅ Frontend on Vercel (already set up)
3. ✅ MongoDB Atlas (already set up)

This gives you a fully scalable, production-ready setup for ~$5/month!
