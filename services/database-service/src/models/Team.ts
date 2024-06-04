import mongoose, { Schema, Document, Model } from 'mongoose';
import { Team } from '@async-msa-poc/types';

export interface ITeam extends Team, Document {}

const teamSchema: Schema<ITeam> = new Schema({
  teamId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  tla: { type: String, required: true, unique: true },
  shortName: { type: String, required: true },
  areaName: { type: String, required: true },
  address: { type: String, required: true },
  players: [{ type: Number, ref: 'Player' }],
  coach: { type: Number, ref: 'Coach' }
});

const Team: Model<ITeam> = mongoose.model('Team', teamSchema);

export default Team;
