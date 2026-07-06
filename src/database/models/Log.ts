import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  action: string;
  userId: string;
  details: any;
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema: Schema = new Schema({
  action: { type: String, required: true },
  userId: { type: String, required: true },
  details: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const Log = mongoose.model<ILog>('Log', LogSchema);
