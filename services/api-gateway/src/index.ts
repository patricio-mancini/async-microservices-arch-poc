import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import resolvers from './resolvers';
import typeDefs from './schema/typeDefs';
import { queryResponseConsumer } from './consumers/queryResponseConsumer';
import { producerManager } from './state';

export async function startService() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const PORT = process.env.PORT || 4000;

    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT as number },
    });

    console.log(`🚀 Server ready at: ${url}`);

    await queryResponseConsumer();

    const gracefulShutdown = async () => {
      console.log('Shutting down gracefully...');
      await producerManager.closeProducer();
      process.exit(0);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startService();
