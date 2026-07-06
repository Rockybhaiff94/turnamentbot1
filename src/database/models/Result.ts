import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  tournamentId: mongoose.Types.ObjectId;
  matchNumber: number;
  placements: Array<{
    teamName: string;
    placement: number;
    kills: number;
    totalPoints: number;
  }>;
  mvp: string; // IGN of the MVP
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema: Schema = new Schema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  matchNumber: { type: Number, required: true },
  placements: [{
    teamName: { type: String, required: true },
    placement: { type: Number, required: true },
    kills: { type: Number, required: true },
    totalPoints: { type: Number, required: true }
  }],
  mvp: { type: String, required: true }
}, { timestamps: true });

export const Result = mongoose.model<IResult>('Result', ResultSchema);
