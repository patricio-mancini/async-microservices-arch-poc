import { KafkaClient } from 'kafka-node';
import { leagueImporterConsumer } from './consumers/leagueImporterConsumer';
import { leagueQueryConsumer } from './consumers/leagueQueryConsumer';
import dotenv from 'dotenv';

dotenv.config();

export async function setupKafka(): Promise<void> {
  const kafkaHost = process.env.KAFKA_BROKER;
  const client = new KafkaClient({ kafkaHost });

  leagueImporterConsumer(client);
  leagueQueryConsumer(client);
}

setupKafka()
  .catch((error) => console.error('Failed to setup Kafka consumers:', error));
