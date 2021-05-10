import { Play, PlayStatus } from '@/interfaces/plays.interface';
import { User } from '@/interfaces/users.interface';
import playModel from '@/models/plays.model';
import { CreatePlayDto } from '@dtos/play.dto';
import HttpException from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class PlayService {
  public plays = playModel;

  public async findOrCreatePracticePlay(playData: CreatePlayDto, user: User): Promise<Play> {
    if (isEmpty(playData)) throw new HttpException(406, 'Selected game not found.');

    const existingPlay = await this.plays.findOne({ gameName: playData.game, player2: null, status: PlayStatus.PENDING, tournamentID: null });
    if (existingPlay) {
      await this.plays.findByIdAndUpdate(existingPlay._id, { player2: user._id, status: PlayStatus.ONGOING });
      return existingPlay;
    }

    const createdPlay = await this.plays.create({
      player1: user._id,
      status: PlayStatus.PENDING,
      state: JSON.stringify({}),
      gameName: playData.game,
      tournamentID: null,
    });
    return createdPlay;
  }
}

export default PlayService;
