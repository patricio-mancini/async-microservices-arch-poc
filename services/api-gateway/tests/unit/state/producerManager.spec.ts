import dotenv from 'dotenv';
dotenv.config();

import { KafkaClient } from 'kafka-node';
import { kafkaUtils } from '@async-msa-poc/utils';
import producerManager from '../../../src/state/producerManager';

jest.mock('dotenv');
jest.mock('kafka-node');
jest.mock('@async-msa-poc/utils');

describe('producerManager', () => {
  it('should create a Kafka client with the correct configuration', () => {
    expect(KafkaClient).toHaveBeenCalledWith({ kafkaHost: process.env.KAFKA_BROKER });
  });

  it('should create a new instance of ProducerManager', () => {
    expect(producerManager).toBeInstanceOf(kafkaUtils.ProducerManager);
  });
});
