import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Need More Proof';

export interface IRegistration extends Document {
  registrationId: string;
  userId: string;
  tournamentId: mongoose.Types.ObjectId;
  ign: string;
  uid: string;
  teamName: string;
  captainName: string;
  phone?: string;
  upiName?: string;
  notes?: string;
  screenshotUrl?: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  registrationId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  ign: { type: String, required: true },
  uid: { type: String, required: true },
  teamName: { type: String, required: true },
  captainName: { type: String, required: true },
  phone: { type: String },
  upiName: { type: String },
  notes: { type: String },
  screenshotUrl: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Need More Proof'],
    default: 'Pending'
  }
}, { timestamps: true });

// Prevent duplicate registrations per tournament
RegistrationSchema.index({ userId: 1, tournamentId: 1 }, { unique: true });
RegistrationSchema.index({ uid: 1, tournamentId: 1 }, { unique: true });

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);
