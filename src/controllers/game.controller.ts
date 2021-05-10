import { NextFunction, Response } from 'express';
import { Play } from '@interfaces/plays.interface';
import { CreatePlayDto } from '@dtos/play.dto';
import PlayService from '@services/play.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class GameController {
  public playService = new PlayService();

  public findPracticeMatch = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const playData: CreatePlayDto = req.body;
      const createPlayData: Play = await this.playService.findOrCreatePracticePlay(playData, req.user);

      res.status(201).json({ data: createPlayData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default GameController;
