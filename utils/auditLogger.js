import AuditLog from '../models/AuditLog.js';

export const logAudit = async (action, req, details = {}, status = 'success') => {
    try {
        const ipAddress = req.ip || 
                         req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         'unknown';

        await AuditLog.create({
            user: req.user?._id || req.user?.id,
            action,
            details,
            ipAddress,
            userAgent: req.headers['user-agent'],
            status,
            metadata: {
                method: req.method,
                path: req.path,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Audit logging error:', error);
        // Don't throw - audit logging should never break the main flow
    }
};

// Middleware to automatically log certain actions
export const auditMiddleware = (action) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failed';
            logAudit(action, req, { response: res.statusCode }, status);
            originalSend.call(this, data);
        };
        next();
    };
};
