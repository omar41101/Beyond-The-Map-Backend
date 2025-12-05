import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getTouristBookings,
    getTouristHistory,
    getTouristDashboard,
    getTouristNFTs
} from '../controllers/touristController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tourist
 *   description: Tourist/User endpoints
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/tourist/bookings:
 *   get:
 *     summary: Get tourist bookings
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings retrieved
 */
router.get('/bookings', getTouristBookings);

/**
 * @swagger
 * /api/tourist/history:
 *   get:
 *     summary: Get complete travel history
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Travel history retrieved
 */
router.get('/history', getTouristHistory);

/**
 * @swagger
 * /api/tourist/dashboard:
 *   get:
 *     summary: Get tourist dashboard
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
router.get('/dashboard', getTouristDashboard);

/**
 * @swagger
 * /api/tourist/nfts:
 *   get:
 *     summary: Get proof of visit NFTs
 *     tags: [Tourist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: NFTs retrieved
 */
router.get('/nfts', getTouristNFTs);

export default router;
