import { KafkaClient } from 'kafka-node';
import { messageBroker } from '@async-msa-poc/constants';
import { kafkaUtils } from '@async-msa-poc/utils';
import { saveLeagueData } from '../operations/leagueData';

export async function leagueImporterConsumer(client: KafkaClient) {
  const consumer = kafkaUtils.createKafkaConsumer(
    client,
    [{ topic: messageBroker.Topics.LEAGUE_IMPORT_PAYLOAD, partition: 0 }],
    { autoCommit: false },
    async (message: any) => {
      if (!message.value) {
        console.error('Received empty message');
        return;
      }

      const leagueData = JSON.parse(message.value);

      try {
        await saveLeagueData(leagueData);
        consumer.commit((err, data) => {
          if (err) {
            console.error('Error committing offset:', err);
          } else {
            console.log('Offset committed:', data);
          }
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  );
}
