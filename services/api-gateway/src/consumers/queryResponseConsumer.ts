import { KafkaClient } from 'kafka-node';
import { messageBroker } from '@async-msa-poc/constants';
import { kafkaUtils } from '@async-msa-poc/utils';
import { resolvePendingRequest, rejectPendingRequest } from '../state/pendingRequests';

export async function queryResponseConsumer() {
  const kafkaHost = process.env.KAFKA_BROKER;
  const client = new KafkaClient({ kafkaHost });

  const onMessage = (message: any) => {
    const response = JSON.parse(message.value);
    const { correlationId, data, error } = response;

    if (error) {
      rejectPendingRequest(correlationId, new Error(error));
    } else {
      resolvePendingRequest(correlationId, data);
    }
  };

  kafkaUtils.createKafkaConsumer(
    client,
    [{ topic: messageBroker.Topics.LEAGUE_QUERY_RESPONSE, partition: 0 }],
    { autoCommit: true },
    onMessage
  );
}
