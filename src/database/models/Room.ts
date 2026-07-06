import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  tournamentId: mongoose.Types.ObjectId;
  roomNumber: number;
  roomId: string;
  password: string;
  map: string;
  round: string;
  matchNumber: number;
  startTime: Date;
  sentTo: string[]; // Array of user IDs the room was sent to
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  roomNumber: { type: Number, required: true },
  roomId: { type: String, required: true },
  password: { type: String, required: true },
  map: { type: String, required: true },
  round: { type: String, required: true },
  matchNumber: { type: Number, required: true },
  startTime: { type: Date, required: true },
  sentTo: [{ type: String }]
}, { timestamps: true });

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
