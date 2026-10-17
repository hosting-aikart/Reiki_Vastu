import app from './app.js';
import env, { isEmailConfigured } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import logger from './utils/logger.js';

let server;

async function bootstrap() {
  try {
    // 1. Connect to Database
    logger.info('Connecting to MongoDB...');
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`Health check available at http://localhost:${env.PORT}/api/health`);
      if (isEmailConfigured()) {
        logger.info(`Owner email notifications: ENABLED (target: ${logger.maskEmail(env.ADMIN_NOTIFICATION_EMAIL)})`);
      } else {
        logger.info('Owner email notifications: UNCONFIGURED. Submissions persist to MongoDB without email dispatch.');
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      logger.info('Database disconnected. Process exiting.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bootstrap();
