import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { PlayService } from '@app/services/play.service';
import { TournamentsService } from '@app/services/tournament.service';
import { UsersService } from '@app/services/users.service';

@Component({
  selector: 'app-tournament-info',
  templateUrl: './tournament-info.component.html',
  styleUrls: ['./tournament-info.component.scss']
})
export class TournamentInfoComponent implements OnInit {
  tournament = {
    createdBy: {
      username: ""
    },
    status: "",
    gameName: "",
    firstPlace: "",
    secondPlace: "",
    thirdPlace: "",
    fourthPlace: "",
    plays: [],
  }
  
  displayedColumns: string[] = ['player1', 'player2', 'result'];
  dataSource = [];

  isOfficial = false;
  isOpen = false;
  id = "";

  constructor(
    private _usersService: UsersService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _playService: PlayService,
    private _tournamentService: TournamentsService
  ) { }

  ngOnInit() {
    this.id = this._activatedRoute.snapshot.paramMap.get('id');
    this.fetchTournament();
    this.checkPermissions();
  }

  async fetchTournament(): Promise<void> {
    const res = await this._tournamentService.getTournament(this.id);
    this.tournament = res.data;
    this.isOpen = res.data.status === 'OPEN';
    this.dataSource = this.tournament.plays;
  }

  async checkPermissions(): Promise<void> {
    const res = await this._authService.getMe();
    this.isOfficial = res.data.role === "OFFICIAL";
  }

  async advanceTournament(): Promise<void> {
    const res = await this._tournamentService.advanceTournament(this.id);
    this.tournament.gameName = res.data.gameName;
  }
}

