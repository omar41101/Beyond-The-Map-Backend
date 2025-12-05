import cron from 'node-cron';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';

/**
 * Tour Status Scheduler
 * Best Practice: Automatically update tour and booking statuses
 * Runs every hour to check and update statuses
 */

// Update tour statuses based on dates
export const updateTourStatuses = async () => {
    try {
        console.log('🔄 Running tour status update...');
        
        const now = new Date();
        
        // Update upcoming to ongoing
        const toursToStart = await Tour.find({
            tourStatus: 'upcoming',
            startDate: { $lte: now },
            endDate: { $gte: now },
            isActive: true
        });
        
        for (const tour of toursToStart) {
            tour.tourStatus = 'ongoing';
            await tour.save();
            console.log(`✅ Tour "${tour.name}" is now ongoing`);
        }
        
        // Update ongoing to completed
        const toursToComplete = await Tour.find({
            tourStatus: 'ongoing',
            endDate: { $lt: now },
            isActive: true
        });
        
        for (const tour of toursToComplete) {
            tour.tourStatus = 'completed';
            await tour.save();
            console.log(`✅ Tour "${tour.name}" is now completed`);
            
            // Auto-complete related bookings
            await Booking.updateMany(
                { 
                    tour: tour._id, 
                    status: 'confirmed',
                    bookingDate: { $lt: now }
                },
                { status: 'completed' }
            );
        }
        
        console.log(`✅ Tour status update completed. Started: ${toursToStart.length}, Completed: ${toursToComplete.length}`);
    } catch (error) {
        console.error('❌ Error updating tour statuses:', error);
    }
};

// Update booking statuses
export const updateBookingStatuses = async () => {
    try {
        console.log('🔄 Running booking status update...');
        
        const now = new Date();
        
        // Auto-complete past bookings that are still confirmed
        const result = await Booking.updateMany(
            {
                status: 'confirmed',
                bookingDate: { $lt: now }
            },
            { status: 'completed' }
        );
        
        console.log(`✅ Booking status update completed. Updated: ${result.modifiedCount} bookings`);
    } catch (error) {
        console.error('❌ Error updating booking statuses:', error);
    }
};

// Clean up expired bookings (auto-cancel pending bookings older than 24 hours)
export const cleanupExpiredBookings = async () => {
    try {
        console.log('🔄 Running expired booking cleanup...');
        
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const result = await Booking.updateMany(
            {
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: { $lt: oneDayAgo }
            },
            { status: 'cancelled' }
        );
        
        console.log(`✅ Expired booking cleanup completed. Cancelled: ${result.modifiedCount} bookings`);
    } catch (error) {
        console.error('❌ Error cleaning up expired bookings:', error);
    }
};

// Initialize all scheduled jobs
export const initializeScheduledJobs = () => {
    console.log('⏰ Initializing scheduled jobs...');
    
    // Run tour status updates every hour
    cron.schedule('0 * * * *', () => {
        console.log('⏰ Hourly tour status update triggered');
        updateTourStatuses();
    });
    
    // Run booking status updates every hour
    cron.schedule('0 * * * *', () => {
        console.log('⏰ Hourly booking status update triggered');
        updateBookingStatuses();
    });
    
    // Clean up expired bookings every 6 hours
    cron.schedule('0 */6 * * *', () => {
        console.log('⏰ Expired booking cleanup triggered');
        cleanupExpiredBookings();
    });
    
    // Run initial updates on startup
    setTimeout(() => {
        updateTourStatuses();
        updateBookingStatuses();
    }, 5000); // Wait 5 seconds for DB connection
    
    console.log('✅ Scheduled jobs initialized');
    console.log('   - Tour status updates: Every hour');
    console.log('   - Booking status updates: Every hour');
    console.log('   - Expired booking cleanup: Every 6 hours');
};
