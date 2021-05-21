import HttpException from '@/exceptions/HttpException';
import { Tournament, TournamentStatus } from '@/interfaces/tournaments.interface';
import tournamentModel from '@/models/tournaments.model';
import { isEmpty } from '@/utils/util';
import { CreateTournamentDto, JoinTournamentDto, UpdateTournamentDto } from '@dtos/tournament.dto';
import { User } from '@/interfaces/users.interface';
import { Play } from '@/interfaces/plays.interface';
import playModel from '@/models/plays.model';

class TournamentService {
  public tournaments = tournamentModel;
  public plays = playModel;

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
    });
    return createTournamentData;
  }

  public async startTournament(tournamentId: string): Promise<Tournament> {
    const updateTournamentById: Tournament = await this.tournaments
      .findByIdAndUpdate(tournamentId, {
        status: TournamentStatus.ONGOING,
      })
      .setOptions({ returnOriginal: false });
    if (!updateTournamentById) throw new HttpException(409, 'Tournament not found');

    return updateTournamentById;
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
