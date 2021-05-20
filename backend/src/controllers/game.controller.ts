import { NextFunction, Response, Request } from 'express';
import { Play } from '@interfaces/plays.interface';
import { CreatePlayDto } from '@dtos/play.dto';
import { CreateTournamentDto, JoinTournamentDto } from '@dtos/tournament.dto';
import PlayService from '@services/play.service';
import { Tournament } from '@interfaces/tournaments.interface';
import TournamentService from '@services/tournament.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class GameController {
  public playService = new PlayService();
  public tournamentService = new TournamentService();

  public findPracticeMatch = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const playData: CreatePlayDto = req.body;
      const createPlayData: Play = await this.playService.findOrCreatePracticePlay(
        playData,
        req.user,
      );

      res.status(201).json({ data: createPlayData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getPracticeHistory = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const historyData: Play[] = await this.playService.findAllPracticeMatches(req.user);

      res.status(201).json({ data: historyData, message: 'practice history' });
    } catch (error) {
      next(error);
    }
  };

  public createTournament = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const tournamentData: CreateTournamentDto = req.body;
      const createTournamentData: Tournament = await this.tournamentService.createTournament(
        tournamentData,
        req.user,
      );

      res.status(201).json({ data: createTournamentData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public joinTournament = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const tournamentData: JoinTournamentDto = req.body;
      const joinTournamentData: Tournament = await this.tournamentService.addTournamentPlayer(
        tournamentData,
        req.user,
      );

      res.status(200).json({ data: joinTournamentData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getTournaments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTournaments: Tournament[] = await this.tournamentService.findAllTournaments();

      res.status(200).json({ data: findAllTournaments, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTournamentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournamentId: string = req.params.id;
      const findTournament: Tournament = await this.tournamentService.findTournamentById(
        tournamentId,
      );

      res.status(200).json({ data: findTournament, message: 'find One' });
    } catch (error) {
      next(error);
    }
  };
}

export default GameController;
