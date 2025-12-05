# Security & Data Protection Guide

## Overview
This backend implements enterprise-grade security features to protect user data and financial transactions.

## Security Features Implemented

### 1. **Rate Limiting**
- **API Rate Limiter**: 100 requests per 15 minutes per IP
- **Auth Rate Limiter**: 5 login attempts per 15 minutes (prevents brute force)
- **Payment Rate Limiter**: 10 payment attempts per hour
- **Registration Rate Limiter**: 3 registrations per hour per IP

### 2. **Input Validation & Sanitization**
- **MongoDB Injection Protection**: Sanitizes all inputs to prevent NoSQL injection
- **XSS Protection**: Cleans data from cross-site scripting attacks
- **Input Validation**: Comprehensive validation rules for all endpoints
  - Email format validation
  - Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
  - Phone number validation
  - Data type and range validation

### 3. **Security Headers (Helmet.js)**
- Content Security Policy (CSP)
- XSS Protection headers
- Prevents clickjacking
- MIME type sniffing prevention
- Cross-Origin Resource Policy

### 4. **Fraud Detection**
- **Suspicious Booking Detection**: Prevents >5 bookings within 1 hour
- **Payment Fraud Detection**: Flags >3 failed payments within 1 hour
- **Amount Validation**: Ensures payment amount matches booking price
- Automatic logging of suspicious activities

### 5. **Audit Logging**
- Comprehensive activity logging for:
  - User registrations and logins
  - Bookings and cancellations
  - Payment transactions (success/failed/refund)
  - Admin actions
  - Role changes
  - Agency/Artist approvals
  - Suspicious activities
- Indexed by user, action, IP address for fast queries
- Includes IP address, user agent, and timestamps

### 6. **Data Encryption**
- **AES-256-CBC Encryption** for sensitive data
- One-way hashing for irreversible data
- Data masking for display (credit cards, etc.)
- Encryption key management via environment variables

### 7. **Two-Factor Authentication (2FA)**
- 6-digit verification codes
- 10-minute expiration
- 3 attempt limit
- Email delivery (ready for SMS integration)
- Middleware for sensitive operations

### 8. **Email Notifications**
- Booking confirmations
- Payment receipts
- 2FA codes
- Agency/Artist approval notifications
- Ready for SendGrid/AWS SES integration

### 9. **Automatic Database Backups**
- Daily backups at 2 AM (production mode)
- 7-day retention policy
- Automatic cleanup of old backups
- Uses mongodump for reliable backups

### 10. **Password Security**
- bcrypt hashing with salt rounds
- Minimum 8 characters
- Required: uppercase, lowercase, number, special character
- Passwords never logged or exposed in responses

## Required Environment Variables

Add these to your `.env` file:

```env
# Existing variables
PORT=9999
MONGODB_URI=mongodb://localhost:27017/beyond-the-map
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# New security variables
ENCRYPTION_KEY=your_32_character_encryption_key_here_change_this
```

## Installation

Install new security dependencies:

```bash
cd backend
npm install express-rate-limit helmet express-mongo-sanitize xss-clean
```

## Usage Examples

### 1. Protected Payment with 2FA
```javascript
// Route with 2FA
router.post('/withdraw', protect, require2FA, processWithdrawal);

// Client sends:
{
  "amount": 1000,
  "twoFactorCode": "123456"
}
```

### 2. Audit Log Query
```javascript
// Get user's activity history
const logs = await AuditLog.find({ user: userId })
  .sort('-createdAt')
  .limit(50);

// Get suspicious activities
const suspicious = await AuditLog.find({ 
  action: 'SUSPICIOUS_ACTIVITY',
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
});
```

### 3. Manual Backup
```javascript
import { backupDatabase } from './utils/backup.js';

// Trigger manual backup
const result = await backupDatabase();
console.log(result); // { success: true, path: '/path/to/backup' }
```

## Best Practices

### For Production Deployment:

1. **Environment Variables**
   - Use strong, unique secrets
   - Never commit `.env` files
   - Rotate keys regularly

2. **Database**
   - Enable MongoDB authentication
   - Use SSL/TLS connections
   - Regular backups to external storage

3. **API Security**
   - Use HTTPS only
   - Implement API key authentication for partners
   - Monitor rate limit violations

4. **Monitoring**
   - Set up alerts for suspicious activities
   - Review audit logs regularly
   - Monitor failed authentication attempts

5. **Email Service**
   - Configure SendGrid or AWS SES
   - Update `emailService.js` with actual provider
   - Enable SPF/DKIM for email authentication

6. **Backups**
   - Store backups in S3 or similar
   - Test restore procedures regularly
   - Encrypt backup files

## Payment Security

### PCI Compliance Considerations:
- **Never store full credit card numbers**
- Use payment gateway tokens only
- Store only last 4 digits for reference
- All payment data encrypted in transit
- Audit all payment transactions

### Integration with Payment Gateways:
The system is designed to work with:
- Stripe
- PayPal
- Square
- Hedera (cryptocurrency)

Replace mock implementations in `paymentController.js` with actual SDK calls.

## Compliance

This implementation helps with:
- **GDPR**: Right to erasure, data portability, audit trails
- **PCI DSS**: Secure payment handling, encryption, logging
- **SOC 2**: Access controls, audit logging, data protection

## Testing Security Features

```bash
# Test rate limiting
for i in {1..10}; do curl -X POST http://localhost:9999/api/auth/login; done

# Test XSS protection
curl -X POST http://localhost:9999/api/tours \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "<script>alert(1)</script>"}'

# Test MongoDB injection
curl -X POST http://localhost:9999/api/auth/login \
  -d '{"email": {"$gt": ""}, "password": {"$gt": ""}}'
```

## Maintenance

### Weekly Tasks:
- Review audit logs for anomalies
- Check backup success
- Monitor rate limit violations

### Monthly Tasks:
- Rotate encryption keys
- Update dependencies
- Review and update security policies

### Quarterly Tasks:
- Security audit
- Penetration testing
- Update compliance documentation

## Support

For security issues or questions:
1. Check audit logs first
2. Review this documentation
3. Contact security team (in production)
4. Never expose sensitive logs publicly

---

**Remember**: Security is not a one-time implementation but an ongoing process. Stay updated with security best practices and regularly review your implementation.
