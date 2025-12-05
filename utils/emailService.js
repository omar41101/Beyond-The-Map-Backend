// Email service for notifications
// In production, integrate with SendGrid, AWS SES, or similar

export const sendEmail = async (to, subject, html) => {
    // TODO: Implement actual email sending
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
    return { success: true };
};

export const sendBookingConfirmation = async (user, booking, tour) => {
    const subject = 'Booking Confirmation - Beyond The Map';
    const html = `
        <h1>Booking Confirmed!</h1>
        <p>Dear ${user.fullName},</p>
        <p>Your booking for "${tour.name}" has been confirmed.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
            <li>Tour: ${tour.name}</li>
            <li>Date: ${new Date(booking.bookingDate).toLocaleDateString()}</li>
            <li>Participants: ${booking.numberOfParticipants}</li>
            <li>Total: $${booking.totalPrice}</li>
        </ul>
        <p>Thank you for choosing Beyond The Map!</p>
    `;
    
    return sendEmail(user.email, subject, html);
};

export const sendPaymentReceipt = async (user, booking, payment) => {
    const subject = 'Payment Receipt - Beyond The Map';
    const html = `
        <h1>Payment Receipt</h1>
        <p>Dear ${user.fullName},</p>
        <p>We have received your payment of $${booking.totalPrice}.</p>
        <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
        <p><strong>Payment Method:</strong> ${payment.gateway}</p>
        <p>Receipt URL: ${payment.receiptUrl || 'N/A'}</p>
    `;
    
    return sendEmail(user.email, subject, html);
};

export const send2FAEmail = async (user, code) => {
    const subject = 'Your Verification Code - Beyond The Map';
    const html = `
        <h1>Verification Code</h1>
        <p>Dear ${user.fullName},</p>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
    `;
    
    return sendEmail(user.email, subject, html);
};

export const sendAgencyApprovalEmail = async (user, agency, status) => {
    const subject = `Agency Application ${status} - Beyond The Map`;
    const html = status === 'approved' 
        ? `
            <h1>Congratulations!</h1>
            <p>Dear ${user.fullName},</p>
            <p>Your agency "${agency.companyName}" has been approved!</p>
            <p>You can now start creating and managing tours.</p>
        `
        : `
            <h1>Agency Application Update</h1>
            <p>Dear ${user.fullName},</p>
            <p>We regret to inform you that your agency application has been ${status}.</p>
            <p>Reason: ${agency.rejectionReason || 'N/A'}</p>
        `;
    
    return sendEmail(user.email, subject, html);
};
