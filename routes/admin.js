import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import {
    getDashboardStats,
    getAllUsers,
    getUserDetails,
    updateUserRole,
    deleteUser,
    getAllTours,
    approveTour,
    getAllBookings,
    getAllReviews,
    deleteReview,
    getAnalytics,
    getAllAgencies,
    approveAgency,
    getAllArtists,
    approveArtist
} from '../controllers/adminController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints (Admin only)
 */

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 */
router.get('/dashboard', getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Users retrieved
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [Admin]
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
 *         description: User details retrieved
 */
router.get('/users/:id', getUserDetails);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
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
 *               role:
 *                 type: string
 *                 enum: [user, agency, artist, admin]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put('/users/:id/role', updateUserRole);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
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
 *         description: User deleted
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Tours retrieved
 */
router.get('/tours', getAllTours);

/**
 * @swagger
 * /api/admin/tours/{id}/approve:
 *   put:
 *     summary: Approve/deactivate tour
 *     tags: [Admin]
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tour status updated
 */
router.put('/tours/:id/approve', approveTour);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Bookings retrieved
 */
router.get('/bookings', getAllBookings);

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Reviews retrieved
 */
router.get('/reviews', getAllReviews);

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Admin]
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
 *         description: Review deleted
 */
router.delete('/reviews/:id', deleteReview);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get advanced analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Analytics retrieved
 */
router.get('/analytics', getAnalytics);

/**
 * @swagger
 * /api/admin/agencies:
 *   get:
 *     summary: Get all agency registrations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *     responses:
 *       200:
 *         description: Agencies retrieved
 */
router.get('/agencies', getAllAgencies);

/**
 * @swagger
 * /api/admin/agencies/{id}/approve:
 *   put:
 *     summary: Approve/reject agency
 *     tags: [Admin]
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
 *                 enum: [approved, rejected]
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agency status updated
 */
router.put('/agencies/:id/approve', approveAgency);

/**
 * @swagger
 * /api/admin/artists:
 *   get:
 *     summary: Get all artist registrations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *     responses:
 *       200:
 *         description: Artists retrieved
 */
router.get('/artists', getAllArtists);

/**
 * @swagger
 * /api/admin/artists/{id}/approve:
 *   put:
 *     summary: Approve/reject artist
 *     tags: [Admin]
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
 *                 enum: [approved, rejected]
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artist status updated
 */
router.put('/artists/:id/approve', approveArtist);

export default router;
