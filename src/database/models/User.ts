import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  ign?: string;
  uid?: string;
  wins: number;
  kills: number;
  earnings: number;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  discordId: { type: String, required: true, unique: true },
  ign: { type: String },
  uid: { type: String },
  wins: { type: Number, default: 0 },
  kills: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  blacklisted: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
