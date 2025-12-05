import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAgency, isAdminOrAgency } from '../middleware/roleCheck.js';
import {
    registerAgency,
    getAgencyProfile,
    updateAgencyProfile,
    getAgencyTours,
    getAgencyBookings,
    getAgencyDashboard,
    getPublicAgencyProfile
} from '../controllers/agencyController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Agency
 *   description: Agency management endpoints
 */

/**
 * @swagger
 * /api/agency/register:
 *   post:
 *     summary: Register as agency
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - licenseNumber
 *               - description
 *             properties:
 *               companyName:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: object
 *               contactInfo:
 *                 type: object
 *               documents:
 *                 type: array
 *     responses:
 *       201:
 *         description: Agency registration submitted
 */
router.post('/register', protect, registerAgency);

/**
 * @swagger
 * /api/agency/profile:
 *   get:
 *     summary: Get agency profile
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agency profile retrieved
 */
router.get('/profile', protect, isAgency, getAgencyProfile);

/**
 * @swagger
 * /api/agency/profile:
 *   put:
 *     summary: Update agency profile
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', protect, isAgency, updateAgencyProfile);

/**
 * @swagger
 * /api/agency/tours:
 *   get:
 *     summary: Get agency tours
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tours retrieved
 */
router.get('/tours', protect, isAgency, getAgencyTours);

/**
 * @swagger
 * /api/agency/bookings:
 *   get:
 *     summary: Get agency bookings
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved
 */
router.get('/bookings', protect, isAgency, getAgencyBookings);

/**
 * @swagger
 * /api/agency/dashboard:
 *   get:
 *     summary: Get agency dashboard
 *     tags: [Agency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
router.get('/dashboard', protect, isAgency, getAgencyDashboard);

/**
 * @swagger
 * /api/agency/public/{id}:
 *   get:
 *     summary: Get public agency profile
 *     tags: [Agency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public profile retrieved
 */
router.get('/public/:id', getPublicAgencyProfile);

export default router;
