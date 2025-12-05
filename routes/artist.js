import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    registerArtist,
    getArtistProfile,
    updateArtistProfile,
    getArtistNFTs,
    getArtistDashboard,
    getPublicArtistProfile
} from '../controllers/artistController.js';
import {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getArtistDashboardStats
} from '../controllers/productController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Artist
 *   description: Artist management endpoints
 */

/**
 * @swagger
 * /api/artist/register:
 *   post:
 *     summary: Register as artist
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistName
 *               - bio
 *               - specialty
 *               - experience
 *             properties:
 *               artistName:
 *                 type: string
 *               bio:
 *                 type: string
 *               specialty:
 *                 type: string
 *               experience:
 *                 type: number
 *     responses:
 *       201:
 *         description: Artist registration submitted
 */
router.post('/register', protect, registerArtist);

/**
 * @swagger
 * /api/artist/profile:
 *   get:
 *     summary: Get artist profile
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artist profile retrieved
 */
router.get('/profile', protect, getArtistProfile);

/**
 * @swagger
 * /api/artist/profile:
 *   put:
 *     summary: Update artist profile
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', protect, updateArtistProfile);

/**
 * @swagger
 * /api/artist/nfts:
 *   get:
 *     summary: Get artist NFTs
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: NFTs retrieved
 */
router.get('/nfts', protect, getArtistNFTs);

/**
 * @swagger
 * /api/artist/dashboard:
 *   get:
 *     summary: Get artist dashboard
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
router.get('/dashboard', protect, getArtistDashboard);

/**
 * @swagger
 * /api/artist/products:
 *   post:
 *     summary: Create new product
 *     tags: [Artist]
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
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stockQuantity:
 *                 type: number
 *               images:
 *                 type: array
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/products', protect, createProduct);

/**
 * @swagger
 * /api/artist/products:
 *   get:
 *     summary: Get artist's products
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved
 */
router.get('/products', protect, getMyProducts);

/**
 * @swagger
 * /api/artist/products/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Artist]
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
 *         description: Product retrieved
 */
router.get('/products/:id', protect, getProductById);

/**
 * @swagger
 * /api/artist/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Artist]
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
 *         description: Product updated
 */
router.put('/products/:id', protect, updateProduct);

/**
 * @swagger
 * /api/artist/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Artist]
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
 *         description: Product deleted
 */
router.delete('/products/:id', protect, deleteProduct);

/**
 * @swagger
 * /api/artist/dashboard/stats:
 *   get:
 *     summary: Get artist dashboard statistics
 *     tags: [Artist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 */
router.get('/dashboard/stats', protect, getArtistDashboardStats);

/**
 * @swagger
 * /api/artist/public/{id}:
 *   get:
 *     summary: Get public artist profile
 *     tags: [Artist]
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
router.get('/public/:id', getPublicArtistProfile);

export default router;
