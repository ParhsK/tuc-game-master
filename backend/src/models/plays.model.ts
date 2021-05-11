import { model, Schema, Document } from 'mongoose';
import { Play, PlayStatus, GameName } from '@/interfaces/plays.interface';

const playSchema: Schema = new Schema({
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: Object.values(PlayStatus),
    required: true,
  },
  state: {
    type: String,
    required: true,
    default: JSON.stringify({}),
  },
  gameName: {
    type: String,
    enum: Object.values(GameName),
    required: true,
  },
  tournamentID: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    default: null,
  },
});

const playModel = model<Play & Document>('Play', playSchema);

export default playModel;
