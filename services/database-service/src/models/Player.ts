import mongoose, { Schema, Document, Model } from 'mongoose';
import { Player } from '@async-msa-poc/types';

export interface IPlayer extends Player, Document {}

const playerSchema: Schema<IPlayer> = new Schema({
  playerId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  dateOfBirth: { type: String},
  nationality: { type: String, required: true },
});

const Player: Model<IPlayer> = mongoose.model('Player', playerSchema);

export default Player;
