import HttpException from '@/exceptions/HttpException';
import { Tournament, TournamentStatus } from '@/interfaces/tournaments.interface';
import tournamentModel from '@/models/tournaments.model';
import { isEmpty } from '@/utils/util';
import { CreateTournamentDto, JoinTournamentDto } from '@dtos/tournament.dto';
import { User } from '@/interfaces/users.interface';

class TournamentService {
  public tournaments = tournamentModel;

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
    const tournaments: Tournament[] = await this.tournaments.find();
    return tournaments;
  }

  public async findTournamentById(tournamentId: string): Promise<Tournament> {
    if (isEmpty(tournamentId)) throw new HttpException(400, 'Tournament ID must be provided');

    const findTournament: Tournament = await this.tournaments.findById(tournamentId);
    if (!findTournament) throw new HttpException(404, 'Tournament does not exist');
    return findTournament;
  }
}

export default TournamentService;
