import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

// Backup database
export const backupDatabase = async () => {
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const backupDir = path.join(process.cwd(), 'backups');
        
        // Create backups directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const backupPath = path.join(backupDir, `backup-${timestamp}`);
        const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond-the-map';

        // Extract database name from URI
        const dbName = dbUri.split('/').pop().split('?')[0];

        const command = `mongodump --uri="${dbUri}" --out="${backupPath}"`;
        
        await execPromise(command);
        
        console.log(`Database backup created: ${backupPath}`);
        
        // Clean old backups (keep last 7 days)
        cleanOldBackups(backupDir, 7);
        
        return { success: true, path: backupPath };
    } catch (error) {
        console.error('Backup error:', error);
        return { success: false, error: error.message };
    }
};

// Clean old backups
const cleanOldBackups = (backupDir, daysToKeep) => {
    try {
        const files = fs.readdirSync(backupDir);
        const now = Date.now();
        const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

        files.forEach(file => {
            const filePath = path.join(backupDir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtimeMs > maxAge) {
                fs.rmSync(filePath, { recursive: true, force: true });
                console.log(`Removed old backup: ${file}`);
            }
        });
    } catch (error) {
        console.error('Cleanup error:', error);
    }
};

// Schedule automatic backups (runs daily at 2 AM)
export const scheduleBackups = () => {
    const cron = require('node-cron');
    
    // Run daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('Running scheduled database backup...');
        await backupDatabase();
    });
    
    console.log('Automatic backups scheduled (daily at 2 AM)');
};
