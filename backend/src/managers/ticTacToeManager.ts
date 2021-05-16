import { MakeMoveDto } from '@/dtos/play.dto';
import HttpException from '@/exceptions/HttpException';
import { PlayStatus } from '@/interfaces/plays.interface';

class TicTacToeManager {
  winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  private validateGameState(gameState: string | string[]): boolean {
    if (gameState.length !== 9) {
      return false;
    }
    let countX = 0;
    let countO = 0;
    for (const cell of gameState) {
      if (cell !== 'X' && cell !== 'O' && cell !== '_') {
        return false;
      }
      if (cell === 'X') {
        countX++;
      }
      if (cell === 'O') {
        countO++;
      }
    }
    if (Math.abs(countX - countO) > 1) {
      return false;
    }
    return true;
  }
  public validateMove(playerMove: MakeMoveDto, gameState: string): boolean {
    if (!this.validateGameState(playerMove.gameState)) {
      return false;
    }
    let counter = 0;
    for (let i = 0; i < 9; i++) {
      if (gameState[i] !== playerMove.gameState[i]) {
        counter++;
        if (gameState[i] === 'X' || gameState[i] === 'O') {
          return false;
        }
      }
    }
    if (counter !== 1) {
      return false;
    }
    return true;
  }

  public initializeState(): string {
    let initialState = '';
    for (let i = 0; i < 9; i++) {
      initialState = initialState.concat('_');
    }
    if (this.validateGameState(initialState)) {
      return initialState;
    }
    throw new HttpException(500, 'could not initialize ticTacToe');
  }
  public checkGameOver(gameState: string): PlayStatus {
    for (const winCon of this.winningConditions) {
      if (
        gameState[winCon[0]] === gameState[winCon[1]] &&
        gameState[winCon[1]] === gameState[winCon[2]] &&
        gameState[winCon[0]] !== '_'
      ) {
        return PlayStatus.WIN;
      }
    }

    for (const winCon of this.winningConditions) {
      const a = gameState[winCon[0]].concat(gameState[winCon[1]], gameState[winCon[2]]);
      if (!a.includes('X') || !a.includes('O')) {
        return PlayStatus.ONGOING;
      }
    }
    return PlayStatus.DRAW;
  }
}

export default TicTacToeManager;
