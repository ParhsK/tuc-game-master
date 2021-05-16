import { GameName } from '@/interfaces/plays.interface';

export class CreatePlayDto {
  public game: GameName;
}

export class MakeMoveDto {
  public gameState: string;
}
