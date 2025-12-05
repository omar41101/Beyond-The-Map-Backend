import Agency from '../models/Agency.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @route   POST /api/agency/register
// @desc    Register as agency (create agency profile)
// @access  Private
export const registerAgency = async (req, res) => {
    try {
        // Check if user already has an agency profile
        const existingAgency = await Agency.findOne({ user: req.user.id });
        if (existingAgency) {
            return res.status(400).json({
                success: false,
                message: 'You already have an agency profile'
            });
        }

        const agencyData = {
            user: req.user.id,
            ...req.body
        };

        const agency = await Agency.create(agencyData);

        res.status(201).json({
            success: true,
            message: 'Agency registration submitted for approval',
            agency
        });
    } catch (error) {
        console.error('Register agency error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering agency',
            error: error.message
        });
    }
};

// @route   GET /api/agency/profile
// @desc    Get agency profile
// @access  Private
export const getAgencyProfile = async (req, res) => {
    try {
        const agency = await Agency.findOne({ user: req.user.id })
            .populate('user', 'fullName email phone');

        if (!agency) {
            return res.status(404).json({
                success: false,
                message: 'Agency profile not found'
            });
        }

        res.json({
            success: true,
            agency
        });
    } catch (error) {
        console.error('Get agency profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching agency profile',
            error: error.message
        });
    }
};

// @route   PUT /api/agency/profile
// @desc    Update agency profile
// @access  Private
export const updateAgencyProfile = async (req, res) => {
    try {
        const agency = await Agency.findOne({ user: req.user.id });

        if (!agency) {
            return res.status(404).json({
                success: false,
                message: 'Agency profile not found'
            });
        }

        const allowedUpdates = ['companyName', 'description', 'address', 'contactInfo', 'documents'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        Object.assign(agency, updates);
        await agency.save();

        res.json({
            success: true,
            message: 'Agency profile updated successfully',
            agency
        });
    } catch (error) {
        console.error('Update agency profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating agency profile',
            error: error.message
        });
    }
};

// @route   GET /api/agency/tours
// @desc    Get agency's tours
// @access  Private
export const getAgencyTours = async (req, res) => {
    try {
        const tours = await Tour.find({ agency: req.user.id })
            .sort('-createdAt');

        res.json({
            success: true,
            count: tours.length,
            tours
        });
    } catch (error) {
        console.error('Get agency tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error.message
        });
    }
};

// @route   GET /api/agency/bookings
// @desc    Get bookings for agency's tours
// @access  Private
export const getAgencyBookings = async (req, res) => {
    try {
        const tours = await Tour.find({ agency: req.user.id }).select('_id');
        const tourIds = tours.map(tour => tour._id);

        const bookings = await Booking.find({ tour: { $in: tourIds } })
            .populate('user', 'fullName email phone')
            .populate('tour', 'name location price')
            .sort('-createdAt');

        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get agency bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// @route   GET /api/agency/dashboard
// @desc    Get agency dashboard statistics
// @access  Private
export const getAgencyDashboard = async (req, res) => {
    try {
        const agency = await Agency.findOne({ user: req.user.id });
        
        if (!agency) {
            return res.status(404).json({
                success: false,
                message: 'Agency profile not found'
            });
        }

        const tours = await Tour.find({ agency: req.user.id });
        const tourIds = tours.map(tour => tour._id);

        const [totalBookings, totalRevenue, recentBookings, tourStats] = await Promise.all([
            Booking.countDocuments({ tour: { $in: tourIds } }),
            Booking.aggregate([
                { $match: { tour: { $in: tourIds }, paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            Booking.find({ tour: { $in: tourIds } })
                .populate('user', 'fullName email')
                .populate('tour', 'name')
                .sort('-createdAt')
                .limit(5),
            Tour.aggregate([
                { $match: { agency: req.user._id } },
                {
                    $group: {
                        _id: '$tourStatus',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        res.json({
            success: true,
            stats: {
                totalTours: tours.length,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                agencyStatus: agency.status,
                tourStats,
                recentBookings
            }
        });
    } catch (error) {
        console.error('Get agency dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard',
            error: error.message
        });
    }
};

// @route   GET /api/agency/public/:id
// @desc    Get public agency profile
// @access  Public
export const getPublicAgencyProfile = async (req, res) => {
    try {
        const agency = await Agency.findById(req.params.id)
            .populate('user', 'fullName email');

        if (!agency) {
            return res.status(404).json({
                success: false,
                message: 'Agency not found'
            });
        }

        if (agency.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Agency is not approved'
            });
        }

        // Get agency tours
        const tours = await Tour.find({ 
            agency: agency.user._id,
            isActive: true 
        }).select('name location price rating images');

        res.json({
            success: true,
            agency: {
                companyName: agency.companyName,
                description: agency.description,
                rating: agency.rating,
                totalTours: agency.totalTours,
                totalBookings: agency.totalBookings,
                contactInfo: agency.contactInfo
            },
            tours
        });
    } catch (error) {
        console.error('Get public agency profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching agency profile',
            error: error.message
        });
    }
};
