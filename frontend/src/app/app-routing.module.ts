import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameSelectorComponent } from './game-selector/game-selector.component';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TournamentInfoComponent } from './tournament-info/tournament-info.component';
import { TournamentsComponent } from './tournament/tournament.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
  { path: 'user/:id', component: UserInfoComponent, canActivate: [AuthGuardService] },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuardService] },
  { path: 'games', component: GameSelectorComponent, canActivate: [AuthGuardService] },
  { path: 'tournaments', component: TournamentsComponent, canActivate: [AuthGuardService] },
  { path: 'tournaments/:id', component: TournamentInfoComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
