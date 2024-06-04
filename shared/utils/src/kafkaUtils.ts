import { KafkaClient, Consumer, Producer } from 'kafka-node';

export class ProducerManager {
  private client: KafkaClient;
  private producer: Producer | null = null;

  constructor(client: KafkaClient) {
    this.client = client;
  }

  async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = new Producer(this.client);
    }
    return this.producer;
  }

  async closeProducer() {
    if (this.producer) {
      await new Promise((resolve: any) => this.producer!.close(resolve));
      this.producer = null;
      console.log('Kafka producer disconnected');
    }
  }
}

export function createKafkaConsumer(client: KafkaClient, topics: { topic: string; partition: number }[], options: any, onMessage: (message: any) => void): Consumer {
  const consumer = new Consumer(client, topics, options);
  consumer.on('message', onMessage);
  consumer.on('error', (error) => {
    console.error('Consumer error:', error);
  });
  return consumer;
}

export async function sendKafkaMessage(manager: ProducerManager, topic: string, message: any): Promise<void> {
  try {
    const producer = await manager.getProducer();
    const payloads = [{ topic, messages: JSON.stringify(message), partition: 0 }];
    await new Promise<void>((resolve, reject) => {
      producer.send(payloads, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error sending Kafka message:', error);
    throw error;
  }
}