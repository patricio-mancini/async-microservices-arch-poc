import dotenv from 'dotenv';
dotenv.config();

import { setupKafka } from './kafka';

setupKafka().catch(error => {
  console.error('Error starting Kafka consumer:', error);
  process.exit(1);
});
