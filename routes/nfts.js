import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    recordNFTMint,
    getMyNFTs,
    getNFT,
    transferNFT
} from '../controllers/nftController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NFTs
 *   description: NFT management endpoints
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/nfts:
 *   post:
 *     summary: Record NFT mint
 *     tags: [NFTs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *               - type
 *               - serialNumber
 *             properties:
 *               tokenId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [proof_of_visit, artisanat, tour_package]
 *               serialNumber:
 *                 type: string
 *               metadata:
 *                 type: object
 *               relatedTour:
 *                 type: string
 *               relatedBooking:
 *                 type: string
 *               hederaTransactionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: NFT recorded successfully
 */
router.post('/', recordNFTMint);

/**
 * @swagger
 * /api/nfts/my-nfts:
 *   get:
 *     summary: Get user's NFTs
 *     tags: [NFTs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: NFTs retrieved successfully
 */
router.get('/my-nfts', getMyNFTs);

/**
 * @swagger
 * /api/nfts/{id}:
 *   get:
 *     summary: Get single NFT
 *     tags: [NFTs]
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
 *         description: NFT retrieved successfully
 */
router.get('/:id', getNFT);

/**
 * @swagger
 * /api/nfts/{id}/transfer:
 *   put:
 *     summary: Update NFT owner after transfer
 *     tags: [NFTs]
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
 *               newOwnerId:
 *                 type: string
 *               hederaTransactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: NFT transfer recorded
 */
router.put('/:id/transfer', transferNFT);

export default router;
