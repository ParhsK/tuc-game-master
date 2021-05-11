import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  async login(username: string, password: string) {
    try {
      const res = await this.http.post('http://localhost:3000/login', {
        "username": username,
        "password": password
      }).toPromise();
    } catch (ex) {
      console.error(ex);
    }
  }
}
