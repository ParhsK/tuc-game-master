export interface Play {
  player1: string;
  player2?: string;
  status: PlayStatus;
  state: string;
  gameName: GameName;
  tournamentID: string;
}

export enum PlayStatus {
  ONGOING = 'ONGOING',
  DRAW = 'DRAW',
  PLAYER1WIN = 'PLAYER1WIN',
  PLAYER2WIN = 'PLAYER2WIN',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export enum GameName {
  CHESS = 'CHESS',
  TIC_TAC_TOE = 'TIC_TAC_TOE',
}
