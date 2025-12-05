import Product from '../models/Product.js';
import Artist from '../models/Artist.js';

// @route   POST /api/artist/products
// @desc    Create a new product
// @access  Private (Artist only)
export const createProduct = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        if (artist.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Your artist profile must be approved before creating products'
            });
        }

        const productData = {
            artist: artist._id,
            ...req.body
        };

        const product = await Product.create(productData);

        // Update artist's total products count
        artist.totalProducts += 1;
        await artist.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// @route   GET /api/artist/products
// @desc    Get all products for logged-in artist
// @access  Private (Artist only)
export const getMyProducts = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const { status, category, sort = '-createdAt' } = req.query;
        
        const query = { artist: artist._id };
        if (status) query.status = status;
        if (category) query.category = category;

        const products = await Product.find(query)
            .sort(sort)
            .populate('artist', 'artistName specialty');

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get my products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// @route   GET /api/artist/products/:id
// @desc    Get single product by ID
// @access  Private (Artist only)
export const getProductById = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const product = await Product.findOne({
            _id: req.params.id,
            artist: artist._id
        }).populate('artist', 'artistName specialty');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @route   PUT /api/artist/products/:id
// @desc    Update product
// @access  Private (Artist only)
export const updateProduct = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const product = await Product.findOne({
            _id: req.params.id,
            artist: artist._id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const allowedUpdates = [
            'name', 'description', 'category', 'price', 'currency', 'images',
            'dimensions', 'weight', 'materials', 'colors', 'stockQuantity',
            'isCustomizable', 'customizationDetails', 'productionTime', 'tags',
            'featured', 'status'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// @route   DELETE /api/artist/products/:id
// @desc    Delete product
// @access  Private (Artist only)
export const deleteProduct = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const product = await Product.findOne({
            _id: req.params.id,
            artist: artist._id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        // Update artist's total products count
        if (artist.totalProducts > 0) {
            artist.totalProducts -= 1;
            await artist.save();
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// @route   GET /api/products/marketplace
// @desc    Get all active products for marketplace (Public)
// @access  Public
export const getMarketplaceProducts = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sort = '-createdAt',
            page = 1,
            limit = 12
        } = req.query;

        const query = { status: 'active' };

        if (category) query.category = category;
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            query.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .populate('artist', 'artistName specialty rating')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            products
        });
    } catch (error) {
        console.error('Get marketplace products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marketplace products',
            error: error.message
        });
    }
};

// @route   GET /api/products/:id
// @desc    Get single product by ID (Public)
// @access  Public
export const getPublicProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('artist', 'artistName specialty rating experience bio socialMedia')
            .populate('reviews.user', 'fullName');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get public product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @route   POST /api/products/:id/like
// @desc    Like/unlike a product
// @access  Private
export const toggleProductLike = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const likeIndex = product.likes.indexOf(req.user.id);

        if (likeIndex > -1) {
            // Unlike
            product.likes.splice(likeIndex, 1);
        } else {
            // Like
            product.likes.push(req.user.id);
        }

        await product.save();

        res.json({
            success: true,
            liked: likeIndex === -1,
            likesCount: product.likes.length
        });
    } catch (error) {
        console.error('Toggle product like error:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling like',
            error: error.message
        });
    }
};

// @route   POST /api/products/:id/review
// @desc    Add review to product
// @access  Private
export const addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            r => r.user.toString() === req.user.id
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = {
            user: req.user.id,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            product
        });
    } catch (error) {
        console.error('Add product review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

// @route   GET /api/artist/dashboard/stats
// @desc    Get artist dashboard statistics
// @access  Private (Artist only)
export const getArtistDashboardStats = async (req, res) => {
    try {
        const artist = await Artist.findOne({ user: req.user.id });
        
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist profile not found'
            });
        }

        const totalProducts = await Product.countDocuments({ artist: artist._id });
        const activeProducts = await Product.countDocuments({ artist: artist._id, status: 'active' });
        const draftProducts = await Product.countDocuments({ artist: artist._id, status: 'draft' });
        const soldProducts = await Product.countDocuments({ artist: artist._id, status: 'sold' });

        const allProducts = await Product.find({ artist: artist._id });
        const totalViews = allProducts.reduce((sum, p) => sum + p.views, 0);
        const totalLikes = allProducts.reduce((sum, p) => sum + p.likes.length, 0);

        const recentProducts = await Product.find({ artist: artist._id })
            .sort('-createdAt')
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalProducts,
                activeProducts,
                draftProducts,
                soldProducts,
                totalViews,
                totalLikes,
                totalSales: artist.totalSales || 0,
                rating: artist.rating,
                status: artist.status
            },
            recentProducts
        });
    } catch (error) {
        console.error('Get artist dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};
