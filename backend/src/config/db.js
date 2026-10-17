import dns from 'dns';
import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

// Configure reliable DNS servers for MongoDB Atlas SRV record resolution (fixes Windows querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Graceful fallback to default system DNS if restricted
}

let isConnecting = false;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    logger.info(`MongoDB already connected to "${mongoose.connection.name}".`);
    return mongoose.connection;
  }

  if (isConnecting) {
    logger.info('MongoDB connection already in progress...');
    return;
  }

  try {
    isConnecting = true;

    // Attach lifecycle listeners once
    if (mongoose.connection.listenerCount('connected') === 0) {
      mongoose.connection.on('connected', () => {
        logger.info(`MongoDB connection established successfully. Active database: "${mongoose.connection.name}".`);
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection lost/disconnected.');
      });
    }

    // Connect to MongoDB Atlas using the configured MONGODB_URI and target reiki_vastu database
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME || 'reiki_vastu',
      serverSelectionTimeoutMS: 10000, // 10-second timeout for server selection
      autoIndex: true                  // Build schema indexes automatically
    });

    isConnecting = false;
    return mongoose.connection;
  } catch (error) {
    isConnecting = false;
    logger.error('Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export default {
  connectDB,
  disconnectDB
};
