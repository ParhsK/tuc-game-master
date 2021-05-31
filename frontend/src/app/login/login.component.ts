import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials = { username: '', password: '' };

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    this.checkAuth();
  }

  async checkAuth() {
    const me = (await this._authService.getMe())?.data;
    if (me._id !== "") {
      this._router.navigate(['/games']);
    }
  }

  async onLoginClick(): Promise<void> {
    const res = await this._authService.login(this.credentials.username, this.credentials.password);
    if (res._id !== "") {
      this._router.navigate(['/games']);
    }
  }

}
