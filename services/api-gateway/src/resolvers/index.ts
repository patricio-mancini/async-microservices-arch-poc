import { v4 as uuidv4 } from 'uuid';
import { messageBroker } from '@async-msa-poc/constants';
import { kafkaUtils } from '@async-msa-poc/utils';
import { Player, Coach } from '@async-msa-poc/types';
import { pendingRequests, producerManager } from '../state';

const resolvers = {
  Query: {
    getPlayers: async (_: any, { leagueCode, teamName }: { leagueCode: string, teamName?: string }) => {
      const correlationId = uuidv4();
      const response = await new Promise((resolve, reject) => {
        pendingRequests.addPendingRequest(correlationId, resolve);

        const payload = {
          queryType: 'getPlayers',
          payload: { leagueCode, teamName },
          correlationId
        };

        kafkaUtils.sendKafkaMessage(producerManager, messageBroker.Topics.LEAGUE_QUERY_REQUEST, payload)
          .catch(err => reject(err));
      });

      return response;
    },
    getTeam: async (_: any, { teamName, resolvePlayers }: { teamName: string, resolvePlayers?: boolean }) => {
      const correlationId = uuidv4();
      const response = await new Promise((resolve, reject) => {
        pendingRequests.addPendingRequest(correlationId, resolve);

        const payload = {
          queryType: 'getTeam',
          payload: { teamName, resolvePlayers },
          correlationId
        };

        kafkaUtils.sendKafkaMessage(producerManager, messageBroker.Topics.LEAGUE_QUERY_REQUEST, payload)
          .catch(err => reject(err));
      });

      return response;
    },
  },
  Mutation: {
    importLeague: async (_: any, { leagueCode }: { leagueCode: string }) => {
      try {
        await kafkaUtils.sendKafkaMessage(producerManager, messageBroker.Topics.LEAGUE_IMPORT_REQUEST, leagueCode);
        return `Import League request for ${leagueCode} successfully triggered`;
      } catch (error) {
        console.error('Error publishing to Kafka:', error);
        throw new Error('Failed to send import request to Kafka');
      }
    },
  },
};

export default resolvers;
