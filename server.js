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
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS must be first to handle preflight requests
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173','https://beyond-the-map-nine.vercel.app/'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security Middleware (after CORS and body parsing)
app.use(securityHeaders);
app.use(apiLimiter);
app.use(sanitizeMongo);
app.use(sanitizeXSS);
app.use(validateInput);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Beyond The Map API Docs'
}));

// Swagger JSON
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

// Root route for Vercel deployment
app.get('/', (req, res) => {
    res.json({ 
        message: 'Beyond The Map API Server',
        status: 'running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            docs: '/api-docs',
            api: '/api/*'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        console.log(`🔒 Security: Rate limiting, XSS protection, MongoDB injection protection enabled`);
        
        // Initialize scheduled jobs for automatic status updates
        initializeScheduledJobs();
        
        // Initialize automatic backups in production
        if (process.env.NODE_ENV === 'production') {
            scheduleBackups();
            console.log(`💾 Automatic database backups enabled (daily at 2 AM)`);
        }
    });
}

export default app;
