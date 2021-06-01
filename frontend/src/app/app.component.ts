import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tgm-web';
  username = "";

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit() {
    this._authService.getMe();
    this._authService.$user.subscribe((user) => {
      this.username = user?.username || "";
    })
  }

  async logout() {
    await this._authService.logout();
    this._router.navigate(['/login']);
  }
}
