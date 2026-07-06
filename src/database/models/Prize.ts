import mongoose, { Schema, Document } from 'mongoose';

export type PrizeStatus = 'Pending' | 'Paid' | 'Rejected';

export interface IPrize extends Document {
  registrationId: string;
  userId: string;
  tournamentId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string; // e.g., 'UPI', 'Bank', 'Paytm'
  paymentDetails: string;
  status: PrizeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PrizeSchema: Schema = new Schema({
  registrationId: { type: String, required: true },
  userId: { type: String, required: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export const Prize = mongoose.model<IPrize>('Prize', PrizeSchema);
