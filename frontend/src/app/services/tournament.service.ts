import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TournamentsService {

  apiURL = environment.apiURL;
  constructor(private http: HttpClient) { }

  async getTournaments() {
    try {
      const res = await this.http.get<{data: any, message: string}>(
        `${this.apiURL}/game/tournaments`,
        { withCredentials: true }
      ).toPromise();
      console.log("Fetched tournaments successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getTournament(tournamentId: string) {
    try {
      const res = await this.http.get<{data: any, message: string}>(
        `${this.apiURL}/game/tournaments/${tournamentId}`,
        { withCredentials: true }
      ).toPromise();
      console.log("Fetched tournament successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async createTournament(gameName: string) {
    try {
      const res = await this.http.post<{data: any, message: string}>(
        `${this.apiURL}/game/tournaments`,
        { game: gameName },
        { withCredentials: true }
      ).toPromise();
      console.log("Created tournament successfully with:", res);
      return res.data;
    } catch (ex) {
      console.error(ex);
    }
  }

  async startTournament(tournamentId: string) {
    try {
      const res = await this.http.put<{data: any, message: string}>(
        `${this.apiURL}/game/tournaments/${tournamentId}`,
        { },
        { withCredentials: true }
      ).toPromise();
      console.log("Updated tournament successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }
}
