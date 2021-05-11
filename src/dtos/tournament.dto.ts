import { GameName } from '@/interfaces/plays.interface';

export class CreateTournamentDto {
  public game: GameName;
}

export class JoinTournamentDto {
  public id: string;
}

export class FindTournamentDto {
  public id: string;
}
