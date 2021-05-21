import { GameName } from '@/interfaces/plays.interface';
import { Tournament, TournamentStatus } from '@/interfaces/tournaments.interface';
import { model, Schema, Document } from 'mongoose';

const userSchema: Schema = new Schema({
  firstPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  secondPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  thirdPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fourthPlace: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  status: {
    type: String,
    enum: Object.values(TournamentStatus),
    required: true,
  },
  round: {
    type: Number,
    default: 0,
  },
});

const tournamentModel = model<Tournament & Document>('Tournament', userSchema);

export default tournamentModel;
