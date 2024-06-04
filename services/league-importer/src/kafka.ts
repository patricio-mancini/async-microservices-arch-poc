import { KafkaClient } from 'kafka-node';
import { LeagueCode } from '@async-msa-poc/types';
import { messageBroker } from '@async-msa-poc/constants';
import { kafkaUtils } from '@async-msa-poc/utils';
import { fetchLeagueData } from './apiService';
import { processLeagueData } from './dataProcessor';

export async function startKafkaConsumer(client: KafkaClient, producerManager: kafkaUtils.ProducerManager): Promise<void> {
  const consumer = kafkaUtils.createKafkaConsumer(
    client,
    [{ topic: messageBroker.Topics.LEAGUE_IMPORT_REQUEST, partition: 0 }],
    { autoCommit: false },
    async (message: any) => {
      const leagueCode: LeagueCode = message.value && JSON.parse(message.value);
      if (!leagueCode) {
        console.error('Received empty message');
        return;
      }
      try {
        const { competitionData, teamsData } = await fetchLeagueData(leagueCode);
        const leagueData = processLeagueData(competitionData, teamsData);

        await publishLeagueData(producerManager, leagueData);

        consumer.commit((err, data) => {
          if (err) {
            console.error('Error committing offset:', err);
          } else {
            console.log('Offset committed:', data);
          }
        });
      } catch (error: any) {
        console.error('Error processing message:', error.message);
      }
    }
  );

  consumer.on('error', (error: any) => {
    console.error('Consumer error:', error);
  });
}

export async function setupKafka(): Promise<void> {
  const kafkaHost = process.env.KAFKA_BROKER;
  const client = new KafkaClient({ kafkaHost });
  const producerManager = new kafkaUtils.ProducerManager(client);

  try {
    await startKafkaConsumer(client, producerManager);
  } catch (error) {
    console.error('Error setting up Kafka consumer:', error);
    throw error;
  }
}

async function publishLeagueData(producerManager: kafkaUtils.ProducerManager, leagueData: any): Promise<void> {
  try {
    await kafkaUtils.sendKafkaMessage(producerManager, messageBroker.Topics.LEAGUE_IMPORT_PAYLOAD, leagueData);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error('Failed to send import request to Kafka');
  }
}
