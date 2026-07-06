import mongoose, { Schema, Document } from 'mongoose';

export type TicketStatus = 'Open' | 'Closed';

export interface ITicket extends Document {
  ticketId: string;
  channelId: string;
  userId: string;
  tournamentId?: mongoose.Types.ObjectId;
  status: TicketStatus;
  transcriptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  channelId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  transcriptUrl: { type: String }
}, { timestamps: true });

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
