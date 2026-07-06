import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utilities/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.uri);
    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};
