import crypto from 'crypto';
import User from '../models/User.js';

// Generate 2FA code
export const generate2FACode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Store 2FA code (in production, use Redis for better performance)
const twoFactorCodes = new Map();

export const send2FACode = async (userId, email) => {
    const code = generate2FACode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    twoFactorCodes.set(userId.toString(), {
        code,
        expiresAt,
        attempts: 0
    });

    // TODO: In production, send code via email/SMS
    console.log(`2FA Code for ${email}: ${code}`);
    
    return { success: true, expiresAt };
};

export const verify2FACode = (userId, code) => {
    const stored = twoFactorCodes.get(userId.toString());

    if (!stored) {
        return { success: false, message: 'No verification code found' };
    }

    if (Date.now() > stored.expiresAt) {
        twoFactorCodes.delete(userId.toString());
        return { success: false, message: 'Verification code expired' };
    }

    if (stored.attempts >= 3) {
        twoFactorCodes.delete(userId.toString());
        return { success: false, message: 'Too many failed attempts' };
    }

    if (stored.code !== code) {
        stored.attempts++;
        return { success: false, message: 'Invalid verification code' };
    }

    twoFactorCodes.delete(userId.toString());
    return { success: true };
};

// Middleware to require 2FA for sensitive operations
export const require2FA = async (req, res, next) => {
    const { twoFactorCode } = req.body;
    
    if (!twoFactorCode) {
        return res.status(400).json({
            success: false,
            message: 'Two-factor authentication code required',
            requires2FA: true
        });
    }

    const verification = verify2FACode(req.user.id, twoFactorCode);
    
    if (!verification.success) {
        return res.status(401).json({
            success: false,
            message: verification.message
        });
    }

    next();
};
