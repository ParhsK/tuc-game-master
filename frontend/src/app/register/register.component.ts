import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  credentials = { email: '', username: '', password: '' };

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

  async onRegisterClick(): Promise<void> {
    const res = await this._authService.register(this.credentials.email, this.credentials.username, this.credentials.password);
    if (res) {
      this._router.navigate(['/login']);
    }
  }
}
