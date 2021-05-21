import { GameName } from '@/interfaces/plays.interface';
import { TournamentStatus } from '@/interfaces/tournaments.interface';

export class CreateTournamentDto {
  public game: GameName;
}

export class JoinTournamentDto {
  public id: string;
}

export class UpdateTournamentDto {
  public status: TournamentStatus;
}
