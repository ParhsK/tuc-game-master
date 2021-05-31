import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tgm-web';
  username = "";

  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this.checkAuth();
  }

  async checkAuth() {
    const me = (await this._authService.getMe())?.data;
    this.username = me.username;
  }
}
