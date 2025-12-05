import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createReview,
    getTourReviews,
    getMyReviews,
    updateReview,
    deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create review
 *     tags: [Reviews]
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
 *               - bookingId
 *               - rating
 *               - comment
 *             properties:
 *               tourId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /api/reviews/tour/{tourId}:
 *   get:
 *     summary: Get reviews for a tour
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/tour/:tourId', getTourReviews);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     summary: Get user's reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('/my-reviews', protect, getMyReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.put('/:id', protect, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
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
 *         description: Review deleted successfully
 */
router.delete('/:id', protect, deleteReview);

export default router;
