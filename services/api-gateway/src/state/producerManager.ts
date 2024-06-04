import dotenv from 'dotenv';
dotenv.config();

import { KafkaClient } from 'kafka-node';
import { kafkaUtils } from '@async-msa-poc/utils';

const kafkaHost = process.env.KAFKA_BROKER;
const client = new KafkaClient({ kafkaHost });

export default new kafkaUtils.ProducerManager(client);
