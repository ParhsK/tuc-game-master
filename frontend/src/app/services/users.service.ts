import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  apiURL = environment.authAPI;
  constructor(private http: HttpClient) { }

  async getUsers() {
    try {
      const res = await this.http.get<{data: any, message: string}>(
        `${this.apiURL}/users`,
        { withCredentials: true }
      ).toPromise();
      console.log("Fetched users successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async getUser(userId: string) {
    try {
      const res = await this.http.get<{data: any, message: string}>(
        `${this.apiURL}/users/${userId}`,
        { withCredentials: true }
      ).toPromise();
      console.log("Fetched user successfully with:", res);
      return res;
    } catch (ex) {
      console.error(ex);
    }
  }

  async changeRole(userId: string, newRole: string) {
    try {
      const res = await this.http.put<{data: any, message: string}>(
        `${this.apiURL}/users/${userId}`,
        { role: newRole },
        { withCredentials: true }
      ).toPromise();
      console.log("Updated user successfully with:", res);
      return res.data;
    } catch (ex) {
      console.error(ex);
    }
  }
}
