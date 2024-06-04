import mongoose, { Schema, Document, Model } from 'mongoose';
import { Competition } from '@async-msa-poc/types';

export interface ICompetition extends Competition, Document {}

const competitionSchema: Schema<ICompetition> = new Schema({
  competitionId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  areaName: { type: String, required: true },
  teams: [{ type: Number, ref: 'Team' }]
});

const Competition: Model<ICompetition> = mongoose.model('Competition', competitionSchema);

export default Competition;
