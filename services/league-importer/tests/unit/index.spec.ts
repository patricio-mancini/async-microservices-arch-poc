import dotenv from 'dotenv';
import { setupKafka } from '../../src/kafka';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('../../src/kafka');

describe('index.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should setup Kafka and handle errors', async () => {
    (setupKafka as jest.Mock).mockRejectedValue(new Error('Kafka error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

    await import('../../src/index');

    expect(dotenv.config).toHaveBeenCalled();
    expect(setupKafka).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error starting Kafka consumer:', new Error('Kafka error'));
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
