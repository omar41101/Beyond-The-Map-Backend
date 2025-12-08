import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, profileImage } = req.body;

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.getPublicProfile()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile',
            error: error.message 
        });
    }
};

// @route   PUT /api/user/change-password
// @desc    Change user password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 8 characters' 
            });
        }

        const user = await User.findById(req.user.id).select('+password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error changing password',
            error: error.message 
        });
    }
};

// @route   PUT /api/user/link-hedera
// @desc    Link Hedera account to user profile
// @access  Private
export const linkHederaAccount = async (req, res) => {
    try {
        const { hederaAccountId } = req.body;

        if (!hederaAccountId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Hedera account ID is required' 
            });
        }

        if (!/^\d+\.\d+\.\d+$/.test(hederaAccountId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid Hedera account ID format' 
            });
        }

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const existingLink = await User.findOne({ 
            hederaAccountId, 
            _id: { $ne: user._id } 
        });
        
        if (existingLink) {
            return res.status(400).json({ 
                success: false, 
                message: 'This Hedera account is already linked to another user' 
            });
        }

        user.hederaAccountId = hederaAccountId;
        await user.save();

        res.json({
            success: true,
            message: 'Hedera account linked successfully',
            user: user.getPublicProfile()
        });
    } catch (error) {
        console.error('Link Hedera account error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error linking Hedera account',
            error: error.message 
        });
    }
};
