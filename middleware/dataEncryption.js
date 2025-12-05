import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Encrypt sensitive data
export const encrypt = (text) => {
    if (!text) return null;
    
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Decrypt sensitive data
export const decrypt = (text) => {
    if (!text) return null;
    
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
};

// Hash sensitive data (one-way)
export const hashData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Mask sensitive data for display
export const maskData = (data, visibleChars = 4) => {
    if (!data) return '';
    if (data.length <= visibleChars) return '*'.repeat(data.length);
    
    return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
};

// Middleware to encrypt sensitive fields before saving
export const encryptSensitiveFields = (fields = []) => {
    return (req, res, next) => {
        if (req.body) {
            fields.forEach(field => {
                if (req.body[field]) {
                    req.body[field] = encrypt(req.body[field]);
                }
            });
        }
        next();
    };
};
