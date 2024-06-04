import { KafkaClient, Consumer, Producer } from 'kafka-node';
import { ProducerManager, createKafkaConsumer, sendKafkaMessage } from '../../src/kafkaUtils';

jest.mock('kafka-node', () => {
  return {
    KafkaClient: jest.fn(),
    Consumer: jest.fn(),
    Producer: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(),
        close: jest.fn((callback) => callback()),
      };
    }),
  };
});

describe('ProducerManager', () => {
  let client: KafkaClient;
  let manager: ProducerManager;

  beforeEach(() => {
    client = new KafkaClient({ kafkaHost: 'mockHost' });
    manager = new ProducerManager(client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null producer', () => {
    expect(manager['producer']).toBeNull();
  });

  it('should return the existing producer if already created', async () => {
    const existingProducer = await manager.getProducer();
    const producer = await manager.getProducer();
    expect(producer).toBe(existingProducer);
  });

  it('should close the producer and set it to null', async () => {
    const producer = await manager.getProducer();
    const closeSpy = jest.spyOn(producer, 'close');

    await manager.closeProducer();
    expect(closeSpy).toHaveBeenCalled();
    expect(manager['producer']).toBeNull();
  });

  it('should log "Kafka producer disconnected" on close', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await manager.getProducer();

    await manager.closeProducer();
    expect(consoleLogSpy).toHaveBeenCalledWith('Kafka producer disconnected');
    consoleLogSpy.mockRestore();
  });
});

describe('sendKafkaMessage', () => {
  let client: KafkaClient;
  let manager: ProducerManager;

  beforeEach(() => {
    client = new KafkaClient({ kafkaHost: 'mockHost' });
    manager = new ProducerManager(client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message to the given topic', async () => {
    const producer = await manager.getProducer();
    const sendSpy = jest.spyOn(producer, 'send').mockImplementation((payloads, callback) => callback(null, null));
    const message = { key: 'value' };

    await sendKafkaMessage(manager, 'test-topic', message);
    expect(sendSpy).toHaveBeenCalledWith([{ topic: 'test-topic', messages: JSON.stringify(message), partition: 0 }], expect.any(Function));
  });

  it('should throw an error if sending the message fails', async () => {
    const producer = await manager.getProducer();
    const sendSpy = jest.spyOn(producer, 'send').mockImplementation((payloads, callback) => callback(new Error('Send error'), null));
    const message = { key: 'value' };

    await expect(sendKafkaMessage(manager, 'test-topic', message)).rejects.toThrow('Send error');
    expect(sendSpy).toHaveBeenCalledWith([{ topic: 'test-topic', messages: JSON.stringify(message), partition: 0 }], expect.any(Function));
  });

  it('should log an error if sending the message fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const producer = await manager.getProducer();
    jest.spyOn(producer, 'send').mockImplementation((payloads, callback) => callback(new Error('Send error'), null));
    const message = { key: 'value' };

    await expect(sendKafkaMessage(manager, 'test-topic', message)).rejects.toThrow('Send error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending Kafka message:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
