import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<any>({
    email: "",
    role: "",
    username: "",
    _id: "",
  });
  public $user: Observable<any>;

  get currentUser() {
    return this.user.value;
  }


  apiURL = environment.authAPI;
  constructor(private http: HttpClient) { }

  async login(username: string, password: string) {
    try {
      const res = await this.http.post<{data: any, message: string}>(`${this.apiURL}/login`, {
        "username": username,
        "password": password
      },{
        withCredentials: true
      }).toPromise();
      console.log("Logged in successfully with:", res);
      this.user.next({
        _id: res.data._id,
        email: res.data.email,
        role: res.data.role,
        username: res.data.username,
      });
      return res.data;
    } catch (ex) {
      console.error(ex);
    }
  }

  async register(email: string, username: string, password: string): Promise<boolean> {
    try {
      const res = await this.http.post(`${this.apiURL}/signup`, {
        "email": email,
        "username": username,
        "password": password
      }).toPromise();
      console.log("Registered successfully with:", res);
      return true;
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }


  async getMe() {
    try {
      const res = await this.http.get<{data: any, message: string}>(
        `${this.apiURL}/users/me`,
        { withCredentials: true }
      ).toPromise();
      this.user.next({
        _id: res.data._id,
        email: res.data.email,
        role: res.data.role,
        username: res.data.username,
      });
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }
}
