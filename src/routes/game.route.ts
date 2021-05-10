import { Router } from 'express';
import GameController from '@controllers/game.controller';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateUserDto } from '@dtos/users.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class GameRoute implements Route {
  public path = '/game';
  public router = Router();
  public gameController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), authMiddleware, this.gameController.findPracticeMatch);
  }
}

export default GameRoute;
