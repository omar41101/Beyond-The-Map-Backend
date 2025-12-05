// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }

    next();
};

// Middleware to check if user is agency
export const isAgency = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }

    if (req.user.role !== 'agency') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Agency only.'
        });
    }

    next();
};

// Middleware to check if user is admin or agency
export const isAdminOrAgency = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'agency') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin or Agency only.'
        });
    }

    next();
};

// Middleware to check if user is admin or artist
export const isAdminOrArtist = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'artist') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin or Artist only.'
        });
    }

    next();
};
