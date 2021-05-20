import { Component, OnInit } from '@angular/core';
import { UsersService } from '@app/services/users.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

 @Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  displayedColumns: string[] = ['username', 'email', 'role', 'score'];
  dataSource = [];

  constructor(private _usersService: UsersService) {
    this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    const res = await this._usersService.getUsers();
    this.dataSource = res.data;
  }

  onRefreshClick(): void {
    this.fetchUsers();
  }
}