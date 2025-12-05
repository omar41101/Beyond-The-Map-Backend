import NFT from '../models/NFT.js';

// @route   POST /api/nfts
// @desc    Record NFT mint
// @access  Private
export const recordNFTMint = async (req, res) => {
    try {
        const { tokenId, type, serialNumber, metadata, relatedTour, relatedBooking, hederaTransactionId } = req.body;
        
        const nft = await NFT.create({
            tokenId,
            type,
            owner: req.user.id,
            serialNumber,
            metadata,
            relatedTour,
            relatedBooking,
            hederaTransactionId
        });
        
        res.status(201).json({
            success: true,
            message: 'NFT recorded successfully',
            nft
        });
    } catch (error) {
        console.error('Record NFT error:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording NFT',
            error: error.message
        });
    }
};

// @route   GET /api/nfts/my-nfts
// @desc    Get user's NFTs
// @access  Private
export const getMyNFTs = async (req, res) => {
    try {
        const nfts = await NFT.find({ owner: req.user.id })
            .populate('relatedTour', 'name location')
            .populate('relatedBooking')
            .sort('-createdAt');
        
        res.json({
            success: true,
            count: nfts.length,
            nfts
        });
    } catch (error) {
        console.error('Get NFTs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NFTs',
            error: error.message
        });
    }
};

// @route   GET /api/nfts/:id
// @desc    Get single NFT
// @access  Private
export const getNFT = async (req, res) => {
    try {
        const nft = await NFT.findById(req.params.id)
            .populate('owner', 'fullName email')
            .populate('relatedTour')
            .populate('relatedBooking');
        
        if (!nft) {
            return res.status(404).json({
                success: false,
                message: 'NFT not found'
            });
        }
        
        res.json({
            success: true,
            nft
        });
    } catch (error) {
        console.error('Get NFT error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NFT',
            error: error.message
        });
    }
};

// @route   PUT /api/nfts/:id/transfer
// @desc    Update NFT owner after transfer
// @access  Private
export const transferNFT = async (req, res) => {
    try {
        const { newOwnerId, hederaTransactionId } = req.body;
        
        const nft = await NFT.findById(req.params.id);
        
        if (!nft) {
            return res.status(404).json({
                success: false,
                message: 'NFT not found'
            });
        }
        
        if (nft.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        nft.owner = newOwnerId;
        nft.hederaTransactionId = hederaTransactionId;
        await nft.save();
        
        res.json({
            success: true,
            message: 'NFT transfer recorded',
            nft
        });
    } catch (error) {
        console.error('Transfer NFT error:', error);
        res.status(500).json({
            success: false,
            message: 'Error transferring NFT',
            error: error.message
        });
    }
};
