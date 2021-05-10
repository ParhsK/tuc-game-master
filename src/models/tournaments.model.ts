import { GameName } from '@/interfaces/plays.interface';
import { Tournament } from '@/interfaces/tournaments.interface';
import { model, Schema, Document } from 'mongoose';

const userSchema: Schema = new Schema({
  firstPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  secondPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thirdPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fourthPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ref: 'User',
    required: true,
  },
  gameName: {
    type: String,
    enum: Object.values(GameName),
    required: true,
  },
});

const tournamentModel = model<Tournament & Document>('Tournament', userSchema);

export default tournamentModel;
