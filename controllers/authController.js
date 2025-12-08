import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email, password, fullName, phone, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Validate role if provided
        const allowedRoles = ['user', 'agency', 'artist'];
        const userRole = role && allowedRoles.includes(role) ? role : 'user';

        const user = await User.create({
            email,
            password,
            fullName,
            phone,
            role: userRole
        });

        const token = generateToken(user._id);
        const userProfile = await user.getPublicProfile();

        console.log(`✅ User registered successfully: ${email} with role: ${userRole}`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userProfile
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering user',
            error: error.message 
        });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);
        const userProfile = await user.getPublicProfile();

        console.log(`✅ User logged in successfully: ${email}`);
        console.log(`📋 User role: ${user.role}`);
        console.log(`📦 User profile:`, JSON.stringify(userProfile, null, 2));

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userProfile
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error logging in',
            error: error.message 
        });
    }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const userProfile = await user.getPublicProfile();

        res.json({
            success: true,
            user: userProfile
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching user data',
            error: error.message 
        });
    }
};
