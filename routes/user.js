import express from 'express';
import { updateProfile, linkHederaAccount } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management endpoints
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Smith
 *               phone:
 *                 type: string
 *                 example: +9876543210
 *               profileImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/user/link-hedera:
 *   put:
 *     summary: Link Hedera account to user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hederaAccountId
 *             properties:
 *               hederaAccountId:
 *                 type: string
 *                 example: 0.0.5876113
 *                 description: Hedera account ID in format 0.0.XXXXX
 *     responses:
 *       200:
 *         description: Hedera account linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid account ID or already linked
 *       401:
 *         description: Not authorized
 */
router.put('/link-hedera', linkHederaAccount);

export default router;
