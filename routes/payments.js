import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdminOrAgency } from '../middleware/roleCheck.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';
import { detectSuspiciousPayment, validateBookingAmount } from '../middleware/fraudDetection.js';
import { validatePayment, validatePaymentConfirmation } from '../middleware/validation.js';
import {
    initiateFiatPayment,
    confirmFiatPayment,
    processRefund,
    getPaymentMethods,
    getPaymentHistory
} from '../controllers/paymentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing endpoints
 */

/**
 * @swagger
 * /api/payments/methods:
 *   get:
 *     summary: Get available payment methods
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment methods retrieved
 */
router.get('/methods', getPaymentMethods);

/**
 * @swagger
 * /api/payments/fiat/initiate:
 *   post:
 *     summary: Initiate fiat payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - paymentGateway
 *             properties:
 *               bookingId:
 *                 type: string
 *               paymentGateway:
 *                 type: string
 *                 enum: [stripe, paypal, square]
 *               currency:
 *                 type: string
 *                 default: USD
 *     responses:
 *       200:
 *         description: Payment initiated
 */
router.post('/fiat/initiate', protect, paymentLimiter, detectSuspiciousPayment, validatePayment, initiateFiatPayment);

/**
 * @swagger
 * /api/payments/fiat/confirm:
 *   post:
 *     summary: Confirm fiat payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - transactionId
 *               - paymentGateway
 *             properties:
 *               bookingId:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               paymentGateway:
 *                 type: string
 *               cardLast4:
 *                 type: string
 *               receiptUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post('/fiat/confirm', protect, paymentLimiter, validateBookingAmount, validatePaymentConfirmation, confirmFiatPayment);

/**
 * @swagger
 * /api/payments/fiat/refund:
 *   post:
 *     summary: Process payment refund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed
 */
router.post('/fiat/refund', protect, isAdminOrAgency, processRefund);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved
 */
router.get('/history', protect, getPaymentHistory);

export default router;
