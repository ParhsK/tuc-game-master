import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURL = environment.apiURL;
  constructor(private http: HttpClient) { }

  async getUsers() {
    try {
      const res = await this.http.get<{data: any, message: string}>(`${this.apiURL}/users`, { withCredentials: true }).toPromise();
      console.log("Fetched users successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getUser(userId: string) {
    try {
      const res = await this.http.get<{data: any, message: string}>(`${this.apiURL}/users/${userId}`, { withCredentials: true }).toPromise();
      console.log("Fetched user successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }
}
