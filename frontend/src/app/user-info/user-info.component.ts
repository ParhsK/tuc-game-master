import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UsersService } from '@app/services/users.service';
import { PlayService } from '@app/services/play.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user = {
    username: "",
    email: "",
    role: "",
    score: "",
  }
  
  displayedColumns: string[] = ['gameName', 'result', 'player1', 'player2'];
  dataSource = [];

  isAdmin: boolean = false;
  isMe: boolean = false;

  constructor(
    private _usersService: UsersService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _playService: PlayService
  ) { }

  ngOnInit() {
    this.fetchUser();
    this.checkPermissions();
    this.getHistoryPractice();
  }

  async getHistoryPractice(): Promise<void> {
    const resMe = await this._authService.getMe();
    this.isMe = resMe.data._id === this._activatedRoute.snapshot.paramMap.get('id');
    if (this.isMe) {
      const resHistory = await this._playService.getHistory();
      this.dataSource = resHistory.data.map((play) => {
        if (play.status === "DRAW") {
          play.result = "Draw";
        } else if (play.status === "WIN") {
          if (play.lastPlayed._id === resMe.data._id) {
            play.result = "Win";
          } else {
            play.result = "Lose";
          }
        } else {
          play.result = "Unfinished";
        }
        return play;
      });
      console.log(this.dataSource)
    }
  }

  async assignNewRole(role: string): Promise<void> {
    const updatedUser = await this._usersService.changeRole(this._activatedRoute.snapshot.paramMap.get('id'), role);
    this.user.role = updatedUser.role;
  }

  async fetchUser(): Promise<void> {
    const res = await this._usersService.getUser(this._activatedRoute.snapshot.paramMap.get('id'));
    this.user.username = res.data.username;
    this.user.email = res.data.email;
    this.user.role = res.data.role;
    this.user.score = res.data.score;
  }

  async checkPermissions(): Promise<void> {
    const res = await this._authService.getMe();
    this.isAdmin = res.data.role === "ADMIN";
  }

}
