import { MakeMoveDto } from '@/dtos/play.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Play } from '@/interfaces/plays.interface';
import PlayService from '@/services/play.service';
import { NextFunction, Response } from 'express';

class PlayController {
  public playService = new PlayService();

  public getActivePlay = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getPlayData: Play = await this.playService.findActivePlay(req.user);

      res.status(200).json({ data: getPlayData, message: 'active play' });
    } catch (error) {
      next(error);
    }
  };

  public getPlayState = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const playId: string = req.params.id;
      const getPlayData: Play = await this.playService.findPlay(playId, req.user);

      res.status(200).json({ data: getPlayData, message: 'play' });
    } catch (error) {
      next(error);
    }
  };

  public makePlayMove = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const playerMove: MakeMoveDto = req.body;
      const playId: string = req.params.id;
      const getPlayData: Play = await this.playService.makeMove(playId, playerMove, req.user);

      res.status(202).json({ data: getPlayData, message: 'move' });
    } catch (error) {
      next(error);
    }
  };
}

export default PlayController;
