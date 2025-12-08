import Tour from '../models/Tour.js';

// @route   GET /api/tours/stats
// @desc    Get tour statistics by status
// @access  Public
export const getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$tourStatus',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);
        
        const totalTours = await Tour.countDocuments({ isActive: true });
        
        res.json({
            success: true,
            totalTours,
            stats
        });
    } catch (error) {
        console.error('Get tour stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tour statistics',
            error: error.message
        });
    }
};

// @route   GET /api/tours/status/:status
// @desc    Get tours by status
// @access  Public
export const getToursByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        
        if (!['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const tours = await Tour.find({ 
            tourStatus: status,
            isActive: true 
        })
        .populate({
            path: 'agency',
            select: 'companyName contactInfo description rating'
        })
        .sort('-createdAt');
        
        // Update status for each tour before sending
        const updatedTours = tours.map(tour => {
            tour.updateStatus();
            return tour;
        });
        
        res.json({
            success: true,
            count: updatedTours.length,
            tours: updatedTours
        });
    } catch (error) {
        console.error('Get tours by status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error.message
        });
    }
};

// @route   GET /api/tours
// @desc    Get all active tours
// @access  Public
export const getTours = async (req, res) => {
    try {
        const { category, location, minPrice, maxPrice, search } = req.query;
        
        let query = { isActive: true };
        
        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const tours = await Tour.find(query)
            .populate({
                path: 'agency',
                select: 'companyName contactInfo description rating'
            })
            .sort('-createdAt');
        
        // Update status for each tour and include time calculations
        const toursWithStatus = tours.map(tour => {
            tour.updateStatus();
            return tour;
        });
        
        res.json({
            success: true,
            count: toursWithStatus.length,
            tours: toursWithStatus
        });
    } catch (error) {
        console.error('Get tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error.message
        });
    }
};

// @route   GET /api/tours/:id
// @desc    Get single tour
// @access  Public
export const getTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        
        // Check if this is a blockchain tour (numeric ID or non-ObjectId format)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(tourId);
        
        if (!isValidObjectId) {
            // This is likely a blockchain tour ID
            // Try to find tour by hederaTourId or return blockchain tour info
            const blockchainTour = await Tour.findOne({ hederaTourId: tourId })
                .populate({
                    path: 'agency',
                    select: 'companyName contactInfo description rating'
                });
            
            if (blockchainTour) {
                blockchainTour.updateStatus();
                await blockchainTour.save();
                
                return res.json({
                    success: true,
                    tour: blockchainTour,
                    timeUntilStart: blockchainTour.timeUntilStart,
                    timeUntilEnd: blockchainTour.timeUntilEnd,
                    currentStatus: blockchainTour.tourStatus,
                    isBlockchainTour: true,
                    requiresWallet: true
                });
            }
            
            // If not found in database, indicate it's a blockchain-only tour
            return res.status(200).json({
                success: true,
                isBlockchainOnly: true,
                requiresWallet: true,
                message: 'This tour exists only on the blockchain. Please connect your wallet to view details.'
            });
        }
        
        // Regular MongoDB tour lookup
        const tour = await Tour.findById(tourId)
            .populate({
                path: 'agency',
                select: 'companyName contactInfo description rating'
            });
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }
        
        // Update status before sending
        tour.updateStatus();
        await tour.save();
        
        res.json({
            success: true,
            tour,
            timeUntilStart: tour.timeUntilStart,
            timeUntilEnd: tour.timeUntilEnd,
            currentStatus: tour.tourStatus,
            isBlockchainTour: !!tour.hederaTourId
        });
    } catch (error) {
        console.error('Get tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tour',
            error: error.message
        });
    }
};

// @route   POST /api/tours
// @desc    Create tour (Agency only)
// @access  Private
export const createTour = async (req, res) => {
    try {
        if (req.user.role !== 'agency' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only agencies can create tours'
            });
        }
        
        const tourData = {
            ...req.body,
            agency: req.user.id
        };
        
        const tour = await Tour.create(tourData);
        
        res.status(201).json({
            success: true,
            message: 'Tour created successfully',
            tour
        });
    } catch (error) {
        console.error('Create tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating tour',
            error: error.message
        });
    }
};

// @route   PUT /api/tours/:id
// @desc    Update tour
// @access  Private (Agency owner or Admin)
export const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }
        
        // Check ownership
        if (tour.agency.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this tour'
            });
        }
        
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Tour updated successfully',
            tour: updatedTour
        });
    } catch (error) {
        console.error('Update tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating tour',
            error: error.message
        });
    }
};

// @route   DELETE /api/tours/:id
// @desc    Delete tour (soft delete)
// @access  Private (Agency owner or Admin)
export const deleteTour = async (req, res) => {
    try {
        console.log('🗑️ Delete tour request:', {
            tourId: req.params.id,
            userId: req.user.id,
            userRole: req.user.role
        });

        const tour = await Tour.findById(req.params.id);
        
        if (!tour) {
            console.log('❌ Tour not found:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        console.log('📋 Tour details:', {
            tourId: tour._id,
            tourAgency: tour.agency,
            requestUserId: req.user.id,
            match: tour.agency.toString() === req.user.id
        });
        
        if (tour.agency.toString() !== req.user.id && req.user.role !== 'admin') {
            console.log('❌ Authorization failed');
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this tour'
            });
        }
        
        // Actually delete the tour instead of just marking as inactive
        await Tour.findByIdAndDelete(req.params.id);
        
        console.log('✅ Tour deleted successfully:', req.params.id);
        
        res.json({
            success: true,
            message: 'Tour deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting tour',
            error: error.message
        });
    }
};

// @route   GET /api/tours/agency/:agencyId
// @desc    Get tours by agency
// @access  Public
export const getToursByAgency = async (req, res) => {
    try {
        const tours = await Tour.find({ 
            agency: req.params.agencyId,
            isActive: true 
        }).sort('-createdAt');
        
        res.json({
            success: true,
            count: tours.length,
            tours
        });
    } catch (error) {
        console.error('Get agency tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching agency tours',
            error: error.message
        });
    }
};
