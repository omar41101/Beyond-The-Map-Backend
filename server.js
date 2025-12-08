import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database.js';
import { swaggerSpec } from './config/swagger.js';
import { initializeScheduledJobs } from './utils/scheduler.js';
import { scheduleBackups } from './utils/backup.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { sanitizeMongo, sanitizeXSS, validateInput } from './middleware/inputSanitization.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import tourRoutes from './routes/tours.js';
import bookingRoutes from './routes/bookings.js';
import nftRoutes from './routes/nfts.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import agencyRoutes from './routes/agency.js';
import artistRoutes from './routes/artist.js';
import touristRoutes from './routes/tourist.js';
import paymentRoutes from './routes/payments.js';
import publicProductRoutes from './routes/publicProducts.js';

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// FIXED CORS — THIS WORKS PERFECTLY ON VERCEL
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://beyond-the-map-three.vercel.app',
        'https://beyond-the-map-nine.vercel.app',
        'https://beyond-the-map.vercel.app', // if you have another deployment
        process.env.FRONTEND_URL,           // for future custom domains
      ].filter(Boolean); // removes undefined values

      // Allow all Vercel preview & production deployments temporarily (very handy)
      if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // important if you use cookies or Authorization header
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Very important on Vercel (fixes preflight 403s)
app.set('trust proxy', 1);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security
app.use(securityHeaders);
app.use(apiLimiter);
app.use(sanitizeMongo);
app.use(sanitizeXSS);
app.use(validateInput);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Beyond The Map API Docs'
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', publicProductRoutes);

// Root & health
app.get('/', (req, res) => {
  res.json({
    message: 'Beyond The Map API Server',
    status: 'running',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Local dev server only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api-docs`);
    initializeScheduledJobs();
    if (process.env.NODE_ENV === 'production') scheduleBackups();
  });
}

export default app;
