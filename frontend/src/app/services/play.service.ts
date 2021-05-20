import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  private currentGame = new BehaviorSubject<any>(null);
  public $currentGame: Observable<any>;

  apiURL = environment.apiURL;
  constructor(private http: HttpClient) {
    this.$currentGame = this.currentGame.asObservable();
  }

  async updateCurrentGame() {
    try {
      const res = await this.http.get<{ data: any, message: string }>(
        `${this.apiURL}/play`,
        { withCredentials: true }
      ).toPromise();
      console.log("Get current game:", res);
      this.currentGame.next(res.data)
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async findPracticePlay(game: string) {
    const playData = { game };
    try {
      const res = await this.http.post<{ data: any, message: string }>(
        `${this.apiURL}/game/findPractice`,
        playData,
        { withCredentials: true }
      ).toPromise();
      console.log("Find practice game:", res);
      this.currentGame.next(res.data)
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getPlayStatus() {
    if (!this.currentGame.value) {
      console.error("No current game found");
    }
    try {
      const res = await this.http.get<{ data: any, message: string }>(
        `${this.apiURL}/play/${this.currentGame.value._id}`,
        { withCredentials: true }
      ).toPromise();
      console.log("Get play status:", res);
      this.currentGame.next(res.data)
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async makeMove(gameState: string) {
    if (!this.currentGame.value) {
      console.error("No current game found");
    }
    const playerMove = { gameState };
    try {
      const res = await this.http.post<{ data: any, message: string }>(
        `${this.apiURL}/play/${this.currentGame.value._id}`,
        playerMove,
        { withCredentials: true }
      ).toPromise();
      console.log("Made move:", res);
      this.currentGame.next(res.data)
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getHistory() {
    try {
      const res = await this.http.get<{ data: any, message: string }>(
        `${this.apiURL}/game/findAllPractices`,
        { withCredentials: true }
      ).toPromise();
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }
}