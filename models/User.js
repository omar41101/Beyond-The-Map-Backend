import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    hederaAccountId: {
        type: String,
        trim: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'agency', 'artist', 'admin'],
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = async function() {
    const profile = {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        phone: this.phone,
        hederaAccountId: this.hederaAccountId,
        role: this.role,
        profileImage: this.profileImage,
        createdAt: this.createdAt
    };

    // Include agency profile if user is an agency
    if (this.role === 'agency') {
        const Agency = mongoose.model('Agency');
        const agencyProfile = await Agency.findOne({ user: this._id });
        if (agencyProfile) {
            profile.agencyProfile = agencyProfile;
        }
    }

    // Include artist profile if user is an artist
    if (this.role === 'artist') {
        const Artist = mongoose.model('Artist');
        const artistProfile = await Artist.findOne({ user: this._id });
        if (artistProfile) {
            profile.artistProfile = artistProfile;
        }
    }

    return profile;
};

const User = mongoose.model('User', userSchema);

export default User;
