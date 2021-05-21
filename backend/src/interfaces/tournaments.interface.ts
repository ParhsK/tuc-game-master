import { GameName, Play } from './plays.interface';

export interface Tournament {
  _id?: string;
  firstPlace?: string;
  secondPlace?: string;
  thirdPlace?: string;
  fourthPlace?: string;
  createdBy: string;
  participants: string[];
  gameName: GameName;
  status: TournamentStatus;
  round: number;
  plays?: Play[];
}

export enum TournamentStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OPEN = 'OPEN',
}
