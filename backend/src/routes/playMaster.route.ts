import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import PlayController from '@/controllers/play.controller';

class PlayRoute implements Route {
  public path = '/play';
  public router = Router();
  public playController = new PlayController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authMiddleware, this.playController.getPlayState);
    this.router.post(`${this.path}/:id`, authMiddleware, this.playController.makePlayMove);
  }
}

export default PlayRoute;
