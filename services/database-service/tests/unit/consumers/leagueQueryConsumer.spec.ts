import { leagueQueryConsumer } from '../../../src/consumers/leagueQueryConsumer';
import { KafkaClient } from 'kafka-node';
import { kafkaUtils } from '@async-msa-poc/utils';
import { getPlayers } from '../../../src/queries/player';
import { getTeam } from '../../../src/queries/team';

jest.mock('kafka-node');
jest.mock('@async-msa-poc/utils');
jest.mock('../../../src/queries/player');
jest.mock('../../../src/queries/team');

describe('leagueQueryConsumer', () => {
  it('should process getPlayers query', async () => {
    const client = new KafkaClient({ kafkaHost: 'test' });
    const createKafkaConsumerMock = kafkaUtils.createKafkaConsumer as jest.Mock;
    const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
    const commitMock = jest.fn();

    createKafkaConsumerMock.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ queryType: 'getPlayers', payload: { leagueCode: 'test' }, correlationId: 'test-id' }) });
      return { commit: commitMock };
    });

    (getPlayers as jest.Mock).mockResolvedValue({ competition: {}, participants: {} });

    await leagueQueryConsumer(client);
    expect(getPlayers).toHaveBeenCalledWith('test', undefined);
    expect(sendKafkaMessageMock).toHaveBeenCalledWith(expect.anything(), 'LEAGUE_QUERY_RESPONSE', {
      correlationId: 'test-id',
      data: { competition: {}, participants: {} }
    });
  });

  it('should process getTeam query', async () => {
    const client = new KafkaClient({ kafkaHost: 'test' });
    const createKafkaConsumerMock = kafkaUtils.createKafkaConsumer as jest.Mock;
    const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
    const commitMock = jest.fn();

    createKafkaConsumerMock.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ queryType: 'getTeam', payload: { teamName: 'test' }, correlationId: 'test-id' }) });
      return { commit: commitMock };
    });

    (getTeam as jest.Mock).mockResolvedValue({ team: {} });

    await leagueQueryConsumer(client);
    expect(getTeam).toHaveBeenCalledWith('test', undefined);
    expect(sendKafkaMessageMock).toHaveBeenCalledWith(expect.anything(), 'LEAGUE_QUERY_RESPONSE', {
      correlationId: 'test-id',
      data: { team: {} }
    });
  });

  it('should log error if query processing fails', async () => {
    const client = new KafkaClient({ kafkaHost: 'test' });
    const createKafkaConsumerMock = kafkaUtils.createKafkaConsumer as jest.Mock;
    const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    createKafkaConsumerMock.mockImplementation((client, topics, options, onMessage) => {
      onMessage({ value: JSON.stringify({ queryType: 'getTeam', payload: { teamName: 'test' }, correlationId: 'test-id' }) });
      return { commit: jest.fn() };
    });

    (getTeam as jest.Mock).mockRejectedValue(new Error('Query error'));

    await leagueQueryConsumer(client);
    expect(sendKafkaMessageMock).toHaveBeenCalledWith(expect.anything(), 'LEAGUE_QUERY_RESPONSE', {
      correlationId: 'test-id',
      error: 'Query error'
    });
    expect(errorSpy).toHaveBeenCalledWith('Error processing query:', expect.any(Error));
  });
});
