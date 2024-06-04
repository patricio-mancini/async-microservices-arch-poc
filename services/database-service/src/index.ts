import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from './database';
import { setupKafka } from './kafka';

export async function startService(): Promise<void> {
  try {
    await connectDatabase();
    await setupKafka();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startService();
