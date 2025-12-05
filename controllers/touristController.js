import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import NFT from '../models/NFT.js';

// @route   GET /api/tourist/bookings
// @desc    Get tourist booking history
// @access  Private
export const getTouristBookings = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = { user: req.user.id };
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('tour', 'name location price duration images agency')
            .populate({
                path: 'tour',
                populate: {
                    path: 'agency',
                    select: 'fullName email'
                }
            })
            .sort('-createdAt');

        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get tourist bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// @route   GET /api/tourist/history
// @desc    Get complete tourist travel history
// @access  Private
export const getTouristHistory = async (req, res) => {
    try {
        const [completedBookings, upcomingBookings, reviews, nfts] = await Promise.all([
            Booking.find({ 
                user: req.user.id,
                status: 'completed'
            })
            .populate('tour', 'name location price images')
            .sort('-bookingDate'),
            
            Booking.find({ 
                user: req.user.id,
                status: { $in: ['pending', 'confirmed'] },
                bookingDate: { $gte: new Date() }
            })
            .populate('tour', 'name location price images')
            .sort('bookingDate'),
            
            Review.find({ user: req.user.id })
            .populate('tour', 'name location')
            .sort('-createdAt'),
            
            NFT.find({ 
                owner: req.user.id,
                type: 'proof_of_visit'
            })
            .populate('relatedTour', 'name location')
            .sort('-createdAt')
        ]);

        const stats = {
            totalTrips: completedBookings.length,
            upcomingTrips: upcomingBookings.length,
            totalReviews: reviews.length,
            totalNFTs: nfts.length,
            totalSpent: completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
        };

        res.json({
            success: true,
            stats,
            completedBookings,
            upcomingBookings,
            reviews,
            nfts
        });
    } catch (error) {
        console.error('Get tourist history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching travel history',
            error: error.message
        });
    }
};

// @route   GET /api/tourist/dashboard
// @desc    Get tourist dashboard
// @access  Private
export const getTouristDashboard = async (req, res) => {
    try {
        const [totalBookings, completedTrips, upcomingTrips, totalNFTs, recentBookings] = await Promise.all([
            Booking.countDocuments({ user: req.user.id }),
            Booking.countDocuments({ 
                user: req.user.id,
                status: 'completed'
            }),
            Booking.countDocuments({ 
                user: req.user.id,
                status: { $in: ['pending', 'confirmed'] },
                bookingDate: { $gte: new Date() }
            }),
            NFT.countDocuments({ 
                owner: req.user.id,
                type: 'proof_of_visit'
            }),
            Booking.find({ user: req.user.id })
            .populate('tour', 'name location price images')
            .sort('-createdAt')
            .limit(5)
        ]);

        const totalSpent = await Booking.aggregate([
            { 
                $match: { 
                    user: req.user._id,
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalBookings,
                completedTrips,
                upcomingTrips,
                totalNFTs,
                totalSpent: totalSpent[0]?.total || 0,
                recentBookings
            }
        });
    } catch (error) {
        console.error('Get tourist dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard',
            error: error.message
        });
    }
};

// @route   GET /api/tourist/nfts
// @desc    Get tourist's proof of visit NFTs
// @access  Private
export const getTouristNFTs = async (req, res) => {
    try {
        const nfts = await NFT.find({ 
            owner: req.user.id,
            type: 'proof_of_visit'
        })
        .populate('relatedTour', 'name location images')
        .populate('relatedBooking')
        .sort('-createdAt');

        res.json({
            success: true,
            count: nfts.length,
            nfts
        });
    } catch (error) {
        console.error('Get tourist NFTs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NFTs',
            error: error.message
        });
    }
};
