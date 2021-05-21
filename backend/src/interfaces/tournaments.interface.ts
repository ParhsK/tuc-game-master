import { GameName, Play } from './plays.interface';

export interface Tournament {
  firstPlace?: string;
  secondPlace?: string;
  thirdPlace?: string;
  fourthPlace?: string;
  createdBy: string;
  participants: string[];
  gameName: GameName;
  status: TournamentStatus;
  plays?: Play[];
}

export enum TournamentStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OPEN = 'OPEN',
}
