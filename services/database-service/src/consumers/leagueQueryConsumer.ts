import { KafkaClient } from 'kafka-node';
import { messageBroker } from '@async-msa-poc/constants';
import { kafkaUtils } from '@async-msa-poc/utils';
import { getPlayers } from '../queries/player';
import { getTeam } from '../queries/team';

export async function leagueQueryConsumer(client: KafkaClient) {
  const producerManager = new kafkaUtils.ProducerManager(client);
  const consumer = kafkaUtils.createKafkaConsumer(
    client,
    [{ topic: messageBroker.Topics.LEAGUE_QUERY_REQUEST, partition: 0 }],
    { autoCommit: false },
    async (message: any) => {
      if (!message.value) {
        console.error('Received empty message');
        return;
      }

      const request = JSON.parse(message.value);
      const { queryType, payload, correlationId } = request;

      try {
        let response;
        if (queryType === 'getPlayers') {
          response = await getPlayers(payload.leagueCode, payload.teamName);
        } else if (queryType === 'getTeam') {
          response = await getTeam(payload.teamName, payload.resolvePlayers);
        } else {
          throw new Error('Unknown query type');
        }
        await kafkaUtils.sendKafkaMessage(producerManager, messageBroker.Topics.LEAGUE_QUERY_RESPONSE, {
          correlationId,
          data: response
        });

        consumer.commit((err, data) => {
          if (err) {
            console.error('Error committing offset:', err);
          } else {
            console.log('Offset committed:', data);
          }
        });
      } catch (error) {
        console.error('Error processing query:', error);
        await kafkaUtils.sendKafkaMessage(producerManager, messageBroker.Topics.LEAGUE_QUERY_RESPONSE, {
          correlationId,
          error: error.message
        });
      }
    }
  );
}
