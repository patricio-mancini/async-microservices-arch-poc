import resolvers from '../../../src/resolvers';
import { v4 as uuidv4 } from 'uuid';
import { kafkaUtils } from '@async-msa-poc/utils';
import { messageBroker } from '@async-msa-poc/constants';
import { pendingRequests, producerManager } from '../../../src/state';

jest.mock('uuid');
jest.mock('@async-msa-poc/utils');
jest.mock('../../../src/state/pendingRequests');

describe('Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query', () => {
    it('should handle getPlayers query', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('test-id');
      const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
      sendKafkaMessageMock.mockResolvedValueOnce(undefined);
      
      const addPendingRequestMock = pendingRequests.addPendingRequest as jest.Mock;
      const resolvePendingRequestMock = jest.fn();
      addPendingRequestMock.mockImplementation((correlationId, resolver) => {
        if (correlationId === 'test-id') {
          resolvePendingRequestMock.mockImplementation(resolver);
        }
      });

      const resultPromise = resolvers.Query.getPlayers(null, { leagueCode: 'test-league', teamName: 'test-team' });
      resolvePendingRequestMock({ players: [], coaches: [] });
      const result = await resultPromise;

      expect(sendKafkaMessageMock).toHaveBeenCalledWith(
        producerManager,
        messageBroker.Topics.LEAGUE_QUERY_REQUEST,
        {
          correlationId: 'test-id',
          payload: { leagueCode: 'test-league', teamName: 'test-team' },
          queryType: 'getPlayers'
        }
      );
      expect(result).toEqual({ players: [], coaches: [] });
    }, 10000); // Increase timeout to 10 seconds

    it('should handle getTeam query', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('test-id');
      const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
      sendKafkaMessageMock.mockResolvedValueOnce(undefined);

      const addPendingRequestMock = pendingRequests.addPendingRequest as jest.Mock;
      const resolvePendingRequestMock = jest.fn();
      addPendingRequestMock.mockImplementation((correlationId, resolver) => {
        if (correlationId === 'test-id') {
          resolvePendingRequestMock.mockImplementation(resolver);
        }
      });

      const resultPromise = resolvers.Query.getTeam(null, { teamName: 'test-team', resolvePlayers: true });
      resolvePendingRequestMock({ team: {}, players: [], coach: {} });
      const result = await resultPromise;

      expect(sendKafkaMessageMock).toHaveBeenCalledWith(
        producerManager,
        messageBroker.Topics.LEAGUE_QUERY_REQUEST,
        {
          correlationId: 'test-id',
          payload: { teamName: 'test-team', resolvePlayers: true },
          queryType: 'getTeam'
        }
      );
      expect(result).toEqual({ team: {}, players: [], coach: {} });
    }, 10000); // Increase timeout to 10 seconds
  });

  describe('Mutation', () => {
    it('should handle importLeague mutation successfully', async () => {
      const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
      sendKafkaMessageMock.mockResolvedValueOnce(undefined);

      const result = await resolvers.Mutation.importLeague(null, { leagueCode: 'test-league' });
      expect(result).toEqual('Import League request for test-league successfully triggered');
    });

    it('should log error and throw if publishing to Kafka fails', async () => {
      const sendKafkaMessageMock = kafkaUtils.sendKafkaMessage as jest.Mock;
      sendKafkaMessageMock.mockRejectedValueOnce(new Error('Kafka error'));

      console.error = jest.fn();

      await expect(resolvers.Mutation.importLeague(null, { leagueCode: 'test-league' })).rejects.toThrow(
        'Failed to send import request to Kafka'
      );
      expect(console.error).toHaveBeenCalledWith('Error publishing to Kafka:', new Error('Kafka error'));
    });
  });
});
