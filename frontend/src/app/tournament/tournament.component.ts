import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { TournamentsService } from '@app/services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentsComponent implements OnInit {
  isOfficial = false;
  displayedColumns: string[] = [ 'gameName', 'participants', 'status', 'createdBy'];
  dataSource = [];

  constructor(private _tournamentService: TournamentsService, private _authService: AuthService) { }
  
  ngOnInit() {
    this.fetchTournaments();
    this.checkPermissions();
  }

  async fetchTournaments(): Promise<void> {
    const res = await this._tournamentService.getTournaments();
    this.dataSource = res.data;
  }

  onRefreshClick(): void {
    this.fetchTournaments();
  }

  async createTournament(gameName: string): Promise<void> {
    const me = await this._authService.getMe();
    const createdTournament = await this._tournamentService.createTournament(gameName);
    createdTournament.createdBy = { username: me.data.username }
    const newData = [ ...this.dataSource ]; 
    newData.push(createdTournament);
    this.dataSource = newData;
  }

  async checkPermissions(): Promise<void> {
    const res = await this._authService.getMe();
    this.isOfficial = res.data.role === "OFFICIAL";
  }
}
