import express from 'express';
import { protect } from '../middleware/auth.js';
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
 *   name: Artist Products
 *   description: Artist product management endpoints
 */

// Artist product routes (protected)
router.post('/products', protect, createProduct);
router.get('/products', protect, getMyProducts);
router.get('/products/:id', protect, getProductById);
router.put('/products/:id', protect, updateProduct);
router.delete('/products/:id', protect, deleteProduct);
router.get('/dashboard/stats', protect, getArtistDashboardStats);

export default router;
