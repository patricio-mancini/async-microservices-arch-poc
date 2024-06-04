import { leagueImporterConsumer } from '../../../src/consumers/leagueImporterConsumer';
import { KafkaClient } from 'kafka-node';
import { kafkaUtils } from '@async-msa-poc/utils';
import { saveLeagueData } from '../../../src/operations/leagueData';

jest.mock('kafka-node');
jest.mock('@async-msa-poc/utils');
jest.mock('../../../src/operations/leagueData');

describe('leagueImporterConsumer', () => {
  it('should process messages and save league data', async () => {
    const client = new KafkaClient({ kafkaHost: 'test' });
    const createKafkaConsumerMock = kafkaUtils.createKafkaConsumer as jest.Mock;
    const commitMock = jest.fn();

    createKafkaConsumerMock.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ competition: {}, teams: [] }) });
      return { commit: commitMock };
    });

    await leagueImporterConsumer(client);
    expect(saveLeagueData).toHaveBeenCalledWith({ competition: {}, teams: [] });
    expect(commitMock).toHaveBeenCalled();
  });

  it('should log error if message processing fails', async () => {
    const client = new KafkaClient({ kafkaHost: 'test' });
    const createKafkaConsumerMock = kafkaUtils.createKafkaConsumer as jest.Mock;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    createKafkaConsumerMock.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ competition: {}, teams: [] }) });
      return { commit: jest.fn() };
    });

    (saveLeagueData as jest.Mock).mockRejectedValue(new Error('Save error'));

    await leagueImporterConsumer(client);
    expect(errorSpy).toHaveBeenCalledWith('Error processing message:', expect.any(Error));
  });
});
