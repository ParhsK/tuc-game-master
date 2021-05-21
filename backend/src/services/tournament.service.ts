import HttpException from '@/exceptions/HttpException';
import { Tournament, TournamentStatus } from '@/interfaces/tournaments.interface';
import tournamentModel from '@/models/tournaments.model';
import { isEmpty } from '@/utils/util';
import { CreateTournamentDto, JoinTournamentDto } from '@dtos/tournament.dto';
import { User } from '@/interfaces/users.interface';
import { GameName, Play, PlayStatus } from '@/interfaces/plays.interface';
import playModel from '@/models/plays.model';
import TicTacToeManager from '@/managers/ticTacToeManager';

class TournamentService {
  public tournaments = tournamentModel;
  public plays = playModel;
  ticTacToeManager = new TicTacToeManager();

  public async createTournament(
    tournamentData: CreateTournamentDto,
    user: User,
  ): Promise<Tournament> {
    if (isEmpty(tournamentData)) throw new HttpException(400, 'Tournament not found');

    const createTournamentData: Tournament = await this.tournaments.create({
      gameName: tournamentData.game,
      participants: [],
      createdBy: user._id,
      status: TournamentStatus.OPEN,
      round: 0,
    });
    return createTournamentData;
  }

  public async advanceTournament(tournamentId: string): Promise<Tournament> {
    const findTournament: Tournament = await this.tournaments.findById(tournamentId);
    if (!findTournament) throw new HttpException(409, 'Tournament not found');
    if (findTournament.participants.length < 4) throw new HttpException(409, 'Not enough players');

    const newRound = findTournament.round + 1;
    const tournamentPlays = await this.plays.find({ tournamentID: tournamentId }).lean();

    // Check all games have finished
    tournamentPlays.forEach(play => {
      if (play.status === PlayStatus.ONGOING) {
        throw new HttpException(409, 'Ongoing games found');
      }
    });

    // Calculate wins per player
    const tournamentPlayers = findTournament.participants
      .map(player => {
        return {
          player,
          wins: tournamentPlays.reduce((sum, play) => {
            // Add wins only to count
            if (
              play.lastPlayed.toString() === player.toString() &&
              play.status === PlayStatus.WIN
            ) {
              return sum + 1;
            }
            return sum;
          }, 0),
        };
      })
      .sort((playerA, playerB) => {
        return playerA.wins - playerB.wins;
      });

    // Compute remaining players
    const playerPool = tournamentPlayers.filter(player => player.wins == findTournament.round - 1);
    const nextRoundPlaysCount = playerPool.length / 2;

    // Check if tournament is complete
    if (nextRoundPlaysCount < 1) {
      // TODO: Test sorting
      const ret: Tournament = await this.tournaments
        .findByIdAndUpdate(tournamentId, {
          status: TournamentStatus.COMPLETED,
          round: newRound,
          firstPlace: tournamentPlayers[0].player,
          secondPlace: tournamentPlayers[1].player,
          thirdPlace: tournamentPlayers[2].player,
          fourthPlace: tournamentPlayers[3].player,
        })
        .setOptions({ returnOriginal: false });
      return ret;
    }

    // Tournament is still going on
    let newState = JSON.stringify({});
    if (findTournament.gameName === GameName.TIC_TAC_TOE) {
      newState = this.ticTacToeManager.initializeState();
    }
    for (let i = 0; i < Math.ceil(nextRoundPlaysCount); i++) {
      // Get random player from participants
      const randomPlayer1 = playerPool.splice(Math.floor(Math.random() * playerPool.length), 1)[0];
      if (playerPool.length === 1) {
        // Last player if count is odd
        await this.plays.create({
          player1: randomPlayer1.player,
          status: PlayStatus.WIN,
          state: newState,
          lastPlayed: randomPlayer1.player,
          gameName: findTournament.gameName,
          tournamentID: findTournament._id,
        });
      } else {
        const randomPlayer2 = playerPool.splice(
          Math.floor(Math.random() * playerPool.length),
          1,
        )[0];
        // Create new games for next round
        await this.plays.create({
          player1: randomPlayer1.player,
          player2: randomPlayer2.player,
          status: PlayStatus.ONGOING,
          state: newState,
          gameName: findTournament.gameName,
          tournamentID: findTournament._id,
        });
      }
    }

    const advanceTournament: Tournament = await this.tournaments
      .findByIdAndUpdate(tournamentId, {
        status: TournamentStatus.ONGOING,
        round: newRound,
      })
      .setOptions({ returnOriginal: false });
    return advanceTournament;
  }

  public async addTournamentPlayer(
    tournamentData: JoinTournamentDto,
    user: User,
  ): Promise<Tournament> {
    if (isEmpty(tournamentData)) throw new HttpException(400, 'Tournament not provided');

    const findTournament = await this.tournaments.findById(tournamentData.id);
    if (findTournament === null) throw new HttpException(404, 'Tournament not found');
    if (findTournament.status !== TournamentStatus.OPEN)
      throw new HttpException(405, 'Tournament not open');
    if (findTournament.participants.indexOf(user._id) >= 0)
      throw new HttpException(400, 'User already registered');
    const newParticipants = findTournament.participants;
    newParticipants.push(user._id);
    const joinTournamentData = await this.tournaments.findByIdAndUpdate(tournamentData.id, {
      participants: newParticipants,
    });
    return joinTournamentData;
  }

  public async findAllTournaments(): Promise<Tournament[]> {
    const tournaments: Tournament[] = await this.tournaments
      .find()
      .populate('createdBy', 'username');
    return tournaments;
  }

  public async findTournamentById(tournamentId: string): Promise<Tournament> {
    if (isEmpty(tournamentId)) throw new HttpException(400, 'Tournament ID must be provided');

    const findTournament: Tournament = await this.tournaments
      .findById(tournamentId)
      .populate('createdBy', 'username')
      .lean();
    if (!findTournament) throw new HttpException(404, 'Tournament does not exist');

    const tournamentPlays: Play[] = await this.plays.find({ tournamentID: tournamentId }).lean();
    findTournament.plays = tournamentPlays;
    return findTournament;
  }
}

export default TournamentService;
