import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import NFT from '../models/NFT.js';
import Review from '../models/Review.js';
import Agency from '../models/Agency.js';
import Artist from '../models/Artist.js';

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalTours,
            totalBookings,
            totalNFTs,
            totalReviews,
            usersByRole,
            toursByStatus,
            bookingsByStatus,
            recentUsers,
            recentBookings
        ] = await Promise.all([
            User.countDocuments(),
            Tour.countDocuments(),
            Booking.countDocuments(),
            NFT.countDocuments(),
            Review.countDocuments(),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]),
            Tour.aggregate([
                { $group: { _id: '$tourStatus', count: { $sum: 1 } } }
            ]),
            Booking.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            User.find().sort('-createdAt').limit(5).select('fullName email role createdAt'),
            Booking.find().sort('-createdAt').limit(5).populate('user', 'fullName email').populate('tour', 'name')
        ]);

        const totalRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalTours,
                totalBookings,
                totalNFTs,
                totalReviews,
                totalRevenue: totalRevenue[0]?.total || 0,
                usersByRole,
                toursByStatus,
                bookingsByStatus,
                recentUsers,
                recentBookings
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @route   GET /api/admin/users/:id
// @desc    Get single user details
// @access  Private (Admin only)
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Base data to fetch
        const dataPromises = [
            Booking.find({ user: user._id }).populate('tour', 'name'),
            Review.find({ user: user._id }).populate('tour', 'name'),
            NFT.find({ owner: user._id })
        ];

        // If user is an agency, fetch agency-specific data
        let agencyData = null;
        if (user.role === 'agency') {
            const [bookings, reviews, nfts, agency, tours] = await Promise.all([
                ...dataPromises,
                Agency.findOne({ owner: user._id }),
                Tour.find({ agencyId: user._id })
            ]);

            agencyData = {
                agency,
                tours,
                tourCount: tours.length,
                activeTours: tours.filter(t => t.isActive).length,
                pendingTours: tours.filter(t => !t.isActive).length
            };

            return res.json({
                success: true,
                user,
                bookings,
                reviews,
                nfts,
                agencyData
            });
        }

        // For non-agency users
        const [bookings, reviews, nfts] = await Promise.all(dataPromises);

        res.json({
            success: true,
            user,
            bookings,
            reviews,
            nfts
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: error.message
        });
    }
};

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'agency', 'artist', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
};

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// @route   GET /api/admin/tours
// @desc    Get all tours (including inactive)
// @access  Private (Admin only)
export const getAllTours = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (status) query.tourStatus = status;
        if (category) query.category = category;

        const tours = await Tour.find(query)
            .populate('agency', 'fullName email')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Tour.countDocuments(query);

        res.json({
            success: true,
            tours,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error.message
        });
    }
};

// @route   PUT /api/admin/tours/:id/approve
// @desc    Approve/activate tour
// @access  Private (Admin only)
export const approveTour = async (req, res) => {
    try {
        const { isActive } = req.body;

        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        );

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        res.json({
            success: true,
            message: `Tour ${isActive ? 'approved' : 'deactivated'} successfully`,
            tour
        });
    } catch (error) {
        console.error('Approve tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating tour status',
            error: error.message
        });
    }
};

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private (Admin only)
export const getAllBookings = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const bookings = await Booking.find(query)
            .populate('user', 'fullName email')
            .populate('tour', 'name location price')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Booking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private (Admin only)
export const getAllReviews = async (req, res) => {
    try {
        const { isVerified, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (isVerified !== undefined) query.isVerified = isVerified === 'true';

        const reviews = await Review.find(query)
            .populate('user', 'fullName email')
            .populate('tour', 'name')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments(query);

        res.json({
            success: true,
            reviews,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete review (admin override)
// @access  Private (Admin only)
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const tourId = review.tour;
        await review.deleteOne();

        // Recalculate tour rating
        const reviews = await Review.find({ tour: tourId });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
            : 0;

        await Tour.findByIdAndUpdate(tourId, {
            rating: avgRating,
            reviewCount: reviews.length
        });

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

// @route   GET /api/admin/analytics
// @desc    Get advanced analytics
// @access  Private (Admin only)
export const getAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        const [
            userGrowth,
            revenueByMonth,
            topTours,
            topAgencies
        ] = await Promise.all([
            User.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            Booking.aggregate([
                { $match: { paymentStatus: 'paid', ...dateFilter } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        revenue: { $sum: '$totalPrice' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            Tour.find({ isActive: true })
                .sort('-rating -reviewCount')
                .limit(10)
                .populate('agency', 'fullName'),
            Booking.aggregate([
                { $match: { paymentStatus: 'paid' } },
                {
                    $lookup: {
                        from: 'tours',
                        localField: 'tour',
                        foreignField: '_id',
                        as: 'tourData'
                    }
                },
                { $unwind: '$tourData' },
                {
                    $group: {
                        _id: '$tourData.agency',
                        totalRevenue: { $sum: '$totalPrice' },
                        bookingCount: { $sum: 1 }
                    }
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'agencyData'
                    }
                },
                { $unwind: '$agencyData' }
            ])
        ]);

        res.json({
            success: true,
            analytics: {
                userGrowth,
                revenueByMonth,
                topTours,
                topAgencies
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message
        });
    }
};

// @route   GET /api/admin/agencies
// @desc    Get all agency registrations
// @access  Private (Admin only)
export const getAllAgencies = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        let query = {};
        // Only filter by status if it's provided and not 'all'
        if (status && status !== 'all') {
            query.status = status;
        }

        console.log('🔍 Admin getAllAgencies - Query params:', { status, page, limit });
        console.log('🔍 Database query:', query);

        const agencies = await Agency.find(query)
            .populate('user', 'fullName email phone hederaAccountId')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Agency.countDocuments(query);

        console.log(`✅ Found ${agencies.length} agencies out of ${count} total`);
        if (agencies.length > 0) {
            console.log('📊 Sample agencies:', agencies.slice(0, 3).map(a => ({
                id: a._id,
                companyName: a.companyName,
                status: a.status,
                user: a.user?.email
            })));
        }

        res.json({
            success: true,
            agencies,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('❌ Get all agencies error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching agencies',
            error: error.message
        });
    }
};

// @route   PUT /api/admin/agencies/:id/approve
// @desc    Approve/reject agency registration
// @access  Private (Admin only)
export const approveAgency = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected'
            });
        }

        const agency = await Agency.findById(req.params.id).populate('user');

        if (!agency) {
            return res.status(404).json({
                success: false,
                message: 'Agency not found'
            });
        }

        agency.status = status;
        if (status === 'approved') {
            agency.approvedBy = req.user.id;
            agency.approvedAt = new Date();
            
            // Update user role to agency
            await User.findByIdAndUpdate(agency.user._id, { role: 'agency' });
        } else if (status === 'rejected') {
            agency.rejectionReason = rejectionReason;
        }

        await agency.save();

        res.json({
            success: true,
            message: `Agency ${status} successfully`,
            agency
        });
    } catch (error) {
        console.error('Approve agency error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating agency status',
            error: error.message
        });
    }
};

// @route   GET /api/admin/artists
// @desc    Get all artist registrations
// @access  Private (Admin only)
export const getAllArtists = async (req, res) => {
    try {
        const { status, specialty, page = 1, limit = 20 } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (specialty) query.specialty = specialty;

        const artists = await Artist.find(query)
            .populate('user', 'fullName email phone')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Artist.countDocuments(query);

        res.json({
            success: true,
            artists,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get all artists error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artists',
            error: error.message
        });
    }
};

// @route   PUT /api/admin/artists/:id/approve
// @desc    Approve/reject artist registration
// @access  Private (Admin only)
export const approveArtist = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected'
            });
        }

        const artist = await Artist.findById(req.params.id).populate('user');

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
        }

        artist.status = status;
        if (status === 'approved') {
            artist.approvedBy = req.user.id;
            artist.approvedAt = new Date();
            
            // Update user role to artist
            await User.findByIdAndUpdate(artist.user._id, { role: 'artist' });
        } else if (status === 'rejected') {
            artist.rejectionReason = rejectionReason;
        }

        await artist.save();

        res.json({
            success: true,
            message: `Artist ${status} successfully`,
            artist
        });
    } catch (error) {
        console.error('Approve artist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating artist status',
            error: error.message
        });
    }
};
