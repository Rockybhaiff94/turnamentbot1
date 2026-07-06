import mongoose, { Schema, Document } from 'mongoose';

export type TournamentStatus = 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Live' | 'Finished' | 'Cancelled';
export type TournamentMode = 'Solo' | 'Duo' | 'Squad';

export interface ITournament extends Document {
  name: string;
  game: string;
  entryFee: number;
  totalSlots: number;
  mode: TournamentMode;
  prizePool: number;
  date: Date;
  time: string;
  checkInTime: string;
  rules: string;
  bannerImage?: string;
  status: TournamentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema: Schema = new Schema({
  name: { type: String, required: true },
  game: { type: String, required: true },
  entryFee: { type: Number, required: true, default: 0 },
  totalSlots: { type: Number, required: true },
  mode: { type: String, enum: ['Solo', 'Duo', 'Squad'], required: true },
  prizePool: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  checkInTime: { type: String, required: true },
  rules: { type: String, required: true },
  bannerImage: { type: String },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Registration Open', 'Registration Closed', 'Live', 'Finished', 'Cancelled'], 
    default: 'Upcoming' 
  },
}, { timestamps: true });

export const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema);
