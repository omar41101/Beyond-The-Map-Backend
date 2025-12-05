import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getToursByAgency,
    getTourStats,
    getToursByStatus
} from '../controllers/tourController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management endpoints
 */

/**
 * @swagger
 * /api/tours/stats:
 *   get:
 *     summary: Get tour statistics
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Tour statistics retrieved
 */
router.get('/stats', getTourStats);

/**
 * @swagger
 * /api/tours/status/{status}:
 *   get:
 *     summary: Get tours by status
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *     responses:
 *       200:
 *         description: Tours retrieved by status
 */
router.get('/status/:status', getToursByStatus);

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all active tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tours retrieved successfully
 */
router.get('/', getTours);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Get single tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour retrieved successfully
 *       404:
 *         description: Tour not found
 */
router.get('/:id', getTour);

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create tour (Agency only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - location
 *               - price
 *               - duration
 *               - maxParticipants
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               maxParticipants:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tour created successfully
 */
router.post('/', protect, createTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update tour
 *     tags: [Tours]
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
 *         description: Tour updated successfully
 */
router.put('/:id', protect, updateTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete tour
 *     tags: [Tours]
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
 *         description: Tour deleted successfully
 */
router.delete('/:id', protect, deleteTour);

/**
 * @swagger
 * /api/tours/agency/{agencyId}:
 *   get:
 *     summary: Get tours by agency
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: agencyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tours retrieved successfully
 */
router.get('/agency/:agencyId', getToursByAgency);

export default router;
