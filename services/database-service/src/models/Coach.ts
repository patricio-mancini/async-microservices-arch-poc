import mongoose, { Schema, Document, Model } from 'mongoose';
import { Coach } from '@async-msa-poc/types';

export interface ICoach extends Coach, Document {}

const coachSchema: Schema<ICoach> = new Schema({
  coachId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  dateOfBirth: { type: String },
  nationality: { type: String, required: true },
});

const Coach: Model<ICoach> = mongoose.model('Coach', coachSchema);

export default Coach;
