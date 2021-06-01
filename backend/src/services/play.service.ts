import { GameName, Play, PlayStatus } from '@/interfaces/plays.interface';
import { User } from '@/interfaces/users.interface';
import TicTacToeManager from '@/managers/ticTacToeManager';
import playModel from '@/models/plays.model';
import { CreatePlayDto, MakeMoveDto } from '@dtos/play.dto';
import HttpException from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class PlayService {
  public plays = playModel;
  ticTacToeManager = new TicTacToeManager();

  public async findOrCreatePracticePlay(playData: CreatePlayDto, user: User): Promise<Play> {
    if (isEmpty(playData)) throw new HttpException(406, 'Selected game not found.');

    const existingPlay = await this.plays.findOne({
      gameName: playData.game,
      player2: null,
      status: PlayStatus.PENDING,
      tournamentID: null,
    });
    if (existingPlay) {
      if (existingPlay.player1.toString() === user._id.toString()) {
        return existingPlay;
      }
      const secondPlayer = Math.floor(Math.random() * 2) === 0 ? existingPlay.player1 : user._id;
      const newPlay = await this.plays
        .findByIdAndUpdate(existingPlay._id, {
          player2: user._id,
          lastPlayed: secondPlayer,
          status: PlayStatus.ONGOING,
        })
        .setOptions({ returnOriginal: false });
      return newPlay;
    }

    let newState = JSON.stringify({});
    if (playData.game === GameName.TIC_TAC_TOE) {
      newState = this.ticTacToeManager.initializeState();
    }

    const createdPlay = await this.plays.create({
      player1: user._id,
      status: PlayStatus.PENDING,
      state: newState,
      gameName: playData.game,
      tournamentID: null,
    });
    return createdPlay;
  }

  public async findAllPracticeMatches(user: User): Promise<Play[]> {
    if (isEmpty(user)) throw new HttpException(406, 'Selected user not found.');

    const practicePlays = await this.plays
      .find({
        $and: [
          { $or: [{ status: PlayStatus.DRAW }, { status: PlayStatus.WIN }] },
          { $or: [{ player1: user._id.toString() }, { player2: user._id.toString() }] },
          { tournamentID: null },
        ],
      })
      .populate('player1', 'username')
      .populate('player2', 'username');
    return practicePlays;
  }

  public async findPlay(playId: string, user: User): Promise<Play> {
    if (isEmpty(playId)) throw new HttpException(406, 'PlayId is required');

    const existingPlay = await this.plays.findOne({
      $or: [{ player1: user._id }, { player2: user._id }],
      _id: playId,
    });
    return existingPlay;
  }

  public async findActivePlay(user: User): Promise<Play> {
    const existingPlay = await this.plays.findOne({
      $and: [
        { $or: [{ player1: user._id }, { player2: user._id }] },
        { $or: [{ status: PlayStatus.PENDING }, { status: PlayStatus.ONGOING }] },
      ],
    });
    return existingPlay;
  }

  public async makeMove(playId: string, playerMove: MakeMoveDto, user: User): Promise<Play> {
    const existingPlay = await this.plays.findOne({
      $or: [{ player1: user._id }, { player2: user._id }],
      _id: playId,
      status: PlayStatus.ONGOING,
    });
    if (!existingPlay) {
      throw new HttpException(404, 'No valid game found');
    }
    if (existingPlay.lastPlayed.toString() === user._id.toString()) {
      throw new HttpException(406, 'Not your turn');
    }

    let gameIsOver = PlayStatus.ONGOING;

    // Validate TicTacToe move
    if (existingPlay.gameName === GameName.TIC_TAC_TOE) {
      const moveIsValid = this.ticTacToeManager.validateMove(playerMove, existingPlay.state);
      if (!moveIsValid) throw new HttpException(406, 'Invalid move');

      gameIsOver = this.ticTacToeManager.checkGameOver(playerMove.gameState);

      // TODO: CHESS
      // } else if (existingPlay.gameName === GameName.CHESS) {
      //   const moveIsValid = chessManager.validateMove(playerMove, existingPlay.state);
      //   if (!moveIsValid) throw new HttpException(406, 'Invalid move');

      //   const nextGameState = chessManager.getGameState(playerMove, existingPlay.state);
      //   const gameIsOver = chessManager.checkGameOver(nextGameState);
      //
    } else {
      throw new HttpException(500, 'Game not found');
    }

    // If a tournament play ends with draw, immediately create a new one to replace it
    if (gameIsOver === PlayStatus.DRAW && existingPlay.tournamentID) {
      let newState = JSON.stringify({});
      if (existingPlay.gameName === GameName.TIC_TAC_TOE) {
        newState = this.ticTacToeManager.initializeState();
      }
      let randomLastPlayer = existingPlay.player1;
      if (Math.floor(Math.random() * 2) === 0) {
        randomLastPlayer = existingPlay.player2;
      }
      await this.plays.create({
        player1: existingPlay.player1,
        player2: existingPlay.player2,
        lastPlayed: randomLastPlayer,
        status: PlayStatus.ONGOING,
        state: newState,
        gameName: existingPlay.gameName,
        tournamentID: existingPlay.tournamentID,
      });
    }

    // Return the updated play
    return this.plays
      .findByIdAndUpdate(playId, {
        state: playerMove.gameState,
        status: gameIsOver,
        lastPlayed: user._id,
      })
      .setOptions({ returnOriginal: false });
  }
}

export default PlayService;
