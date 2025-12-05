import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getMarketplaceProducts,
    getPublicProduct,
    toggleProductLike,
    addProductReview
} from '../controllers/productController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Public product marketplace endpoints
 */

/**
 * @swagger
 * /api/public/products/marketplace:
 *   get:
 *     summary: Get all marketplace products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
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
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/marketplace', getMarketplaceProducts);

/**
 * @swagger
 * /api/public/products/{id}:
 *   get:
 *     summary: Get single product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', getPublicProduct);

/**
 * @swagger
 * /api/public/products/{id}/like:
 *   post:
 *     summary: Toggle product like
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       401:
 *         description: Not authorized
 */
router.post('/:id/like', protect, toggleProductLike);

/**
 * @swagger
 * /api/public/products/{id}/review:
 *   post:
 *     summary: Add product review
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       401:
 *         description: Not authorized
 */
router.post('/:id/review', protect, addProductReview);

export default router;
