import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
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
  }

  async onLoginClick(): Promise<void> {
    console.log({ u: this.credentials.username, p: this.credentials.password });
    await this._authService.login('peps', '123asd666');
    // this._router.navigate(['/dashboard']);
  }

}
