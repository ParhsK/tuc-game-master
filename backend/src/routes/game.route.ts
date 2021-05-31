import { Router } from 'express';
import GameController from '@controllers/game.controller';
import Route from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { Role } from '@/interfaces/users.interface';
import roleMiddleware from '@/middlewares/role.middleware';

class GameRoute implements Route {
  public path = '/game';
  public router = Router();
  public gameController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/findPractice`,
      authMiddleware,
      this.gameController.findPracticeMatch,
    );
    this.router.get(
      `${this.path}/findAllPractices`,
      authMiddleware,
      this.gameController.getPracticeHistory,
    );
    this.router.get(`${this.path}/tournaments`, authMiddleware, this.gameController.getTournaments);
    this.router.post(
      `${this.path}/tournaments`,
      authMiddleware,
      roleMiddleware([Role.OFFICIAL]),
      this.gameController.createTournament,
    );
    this.router.post(
      `${this.path}/tournaments/join`,
      authMiddleware,
      this.gameController.joinTournament,
    );
    this.router.get(
      `${this.path}/tournaments/:id`,
      authMiddleware,
      this.gameController.getTournamentById,
    );
    this.router.put(
      `${this.path}/tournaments/:id`,
      authMiddleware,
      roleMiddleware([Role.OFFICIAL]),
      this.gameController.advanceTournament,
    );
  }
}

export default GameRoute;
