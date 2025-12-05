import Artist from '../models/Artist.js';
import NFT from '../models/NFT.js';

// @route   POST /api/artist/register
// @desc    Register as artist (create artist profile)
// @access  Private
export const registerArtist = async (req, res) => {
    try {
        // Check if user already has an artist profile
        const existingArtist = await Artist.findOne({ user: req.user.id });
        if (existingArtist) {
            return res.status(400).json({
                success: false,
                message: 'You already have an artist profile'
            });
        }

        const artistData = {
            user: req.user.id,
            ...req.body
        };

        const artist = await Artist.create(artistData);

        res.status(201).json({
            success: true,
            message: 'Artist registration submitted for approval',
            artist
        });
    } catch (error) {
        console.error('Register artist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering artist',
            error: error.message
        });
    }
};

// @route   GET /api/artist/profile
// @desc    Get artist profile
// @access  Private
export const getArtistProfile = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id })
            .populate('user', 'fullName email phone');

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        res.json({
            success: true,
            artist
        });
    } catch (error) {
        console.error('Get artist profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artist profile',
            error: error.message
        });
    }
};

// @route   PUT /api/artist/profile
// @desc    Update artist profile
// @access  Private
export const updateArtistProfile = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const allowedUpdates = ['artistName', 'bio', 'specialty', 'experience', 'portfolio', 'certifications', 'socialMedia'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        Object.assign(artist, updates);
        await artist.save();

        res.json({
            success: true,
            message: 'Artist profile updated successfully',
            artist
        });
    } catch (error) {
        console.error('Update artist profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating artist profile',
            error: error.message
        });
    }
};

// @route   GET /api/artist/nfts
// @desc    Get artist's NFTs
// @access  Private
export const getArtistNFTs = async (req, res) => {
    try {
        const nfts = await NFT.find({ owner: req.user.id, type: 'artisanat' })
            .sort('-createdAt');

        res.json({
            success: true,
            count: nfts.length,
            nfts
        });
    } catch (error) {
        console.error('Get artist NFTs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NFTs',
            error: error.message
        });
    }
};

// @route   GET /api/artist/dashboard
// @desc    Get artist dashboard statistics
// @access  Private
export const getArtistDashboard = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const totalNFTs = await NFT.countDocuments({ 
            owner: req.user.id,
            type: 'artisanat'
        });

        const recentNFTs = await NFT.find({ 
            owner: req.user.id,
            type: 'artisanat'
        })
        .sort('-createdAt')
        .limit(5);

        res.json({
            success: true,
            stats: {
                totalNFTs,
                totalProducts: artist.totalProducts,
                totalSales: artist.totalSales,
                rating: artist.rating,
                status: artist.status,
                recentNFTs
            }
        });
    } catch (error) {
        console.error('Get artist dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard',
            error: error.message
        });
    }
};

// @route   GET /api/artist/public/:id
// @desc    Get public artist profile
// @access  Public
export const getPublicArtistProfile = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id)
            .populate('user', 'fullName email');

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
        }

        if (artist.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Artist is not approved'
            });
        }

        // Get artist NFTs
        const nfts = await NFT.find({ 
            owner: artist.user._id,
            type: 'artisanat'
        }).select('metadata serialNumber').limit(12);

        res.json({
            success: true,
            artist: {
                artistName: artist.artistName,
                bio: artist.bio,
                specialty: artist.specialty,
                experience: artist.experience,
                portfolio: artist.portfolio,
                socialMedia: artist.socialMedia,
                rating: artist.rating,
                totalProducts: artist.totalProducts
            },
            nfts
        });
    } catch (error) {
        console.error('Get public artist profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artist profile',
            error: error.message
        });
    }
};
