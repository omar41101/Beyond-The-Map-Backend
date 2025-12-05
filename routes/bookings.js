import express from 'express';
import { protect, allowFiatPayment } from '../middleware/auth.js';
import { detectSuspiciousBooking } from '../middleware/fraudDetection.js';
import { validateBooking, validateMongoId } from '../middleware/validation.js';
import {
    createBooking,
    getMyBookings,
    getBooking,
    updateBookingStatus,
    updatePaymentStatus,
    cancelBooking
} from '../controllers/bookingController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create booking (supports both wallet and fiat payments)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *               - bookingDate
 *               - numberOfParticipants
 *             properties:
 *               tourId:
 *                 type: string
 *               bookingDate:
 *                 type: string
 *                 format: date
 *               numberOfParticipants:
 *                 type: number
 *               specialRequests:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [wallet, fiat]
 *               email:
 *                 type: string
 *                 description: Required for fiat payments without authentication
 *               customerName:
 *                 type: string
 *                 description: Required for fiat payments without authentication
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
// Allow fiat payments without authentication
router.post('/', allowFiatPayment, detectSuspiciousBooking, validateBooking, createBooking);

// Protected routes - require authentication
router.use(protect);

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 */
router.get('/my-bookings', getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get single booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 */
router.get('/:id', getBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}/payment:
 *   put:
 *     summary: Update payment status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, refunded]
 *               hederaTransactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated successfully
 */
router.put('/:id/payment', updatePaymentStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 */
router.delete('/:id', cancelBooking);

export default router;
