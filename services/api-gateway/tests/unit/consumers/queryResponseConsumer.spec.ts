import { KafkaClient } from 'kafka-node';
import { messageBroker } from '@async-msa-poc/constants';
import { kafkaUtils } from '@async-msa-poc/utils';
import { resolvePendingRequest, rejectPendingRequest } from '../../../src/state/pendingRequests';
import { queryResponseConsumer } from '../../../src/consumers/queryResponseConsumer';

jest.mock('kafka-node');
jest.mock('@async-msa-poc/constants');
jest.mock('@async-msa-poc/utils');
jest.mock('../../../src/state/pendingRequests');

describe('queryResponseConsumer', () => {
  it('should create a Kafka consumer and handle messages correctly', async () => {
    const mockClient = {} as KafkaClient;
    const mockCreateKafkaConsumer = kafkaUtils.createKafkaConsumer as jest.Mock;

    const mockOnMessage = jest.fn();
    mockCreateKafkaConsumer.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ correlationId: 'test-id', data: 'test-data' }) });
      return { on: jest.fn() };
    });

    await queryResponseConsumer();

    expect(mockCreateKafkaConsumer).toHaveBeenCalledWith(
      expect.any(Object),
      [{ topic: messageBroker.Topics.LEAGUE_QUERY_RESPONSE, partition: 0 }],
      { autoCommit: true },
      expect.any(Function)
    );

    expect(resolvePendingRequest).toHaveBeenCalledWith('test-id', 'test-data');
  });

  it('should handle message errors correctly', async () => {
    const mockClient = {} as KafkaClient;
    const mockCreateKafkaConsumer = kafkaUtils.createKafkaConsumer as jest.Mock;

    const mockOnMessage = jest.fn();
    mockCreateKafkaConsumer.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ correlationId: 'test-id', error: 'test-error' }) });
      return { on: jest.fn() };
    });

    await queryResponseConsumer();

    expect(mockCreateKafkaConsumer).toHaveBeenCalledWith(
      expect.any(Object),
      [{ topic: messageBroker.Topics.LEAGUE_QUERY_RESPONSE, partition: 0 }],
      { autoCommit: true },
      expect.any(Function)
    );

    expect(rejectPendingRequest).toHaveBeenCalledWith('test-id', new Error('test-error'));
  });
});
