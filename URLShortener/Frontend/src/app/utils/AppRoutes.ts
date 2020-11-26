import { Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/utils/guards/authentication.guard';
import { DenyaccessGuard } from 'src/app/utils/guards/denyaccess.guard';
import { HomeComponent } from '../home/home.component';
import { InfoBoxComponent } from '../home/info-box/info-box.component';
import { LoginBoxComponent } from '../home/info-box/login-box/login-box.component';
import { RegisterBoxComponent } from '../home/info-box/register-box/register-box.component';
import { UserBoxComponent } from '../home/info-box/user-box/user-box.component';
import { UserEditComponent } from '../home/info-box/user-box/user-edit/user-edit.component';
import { WelcomeBoxComponent } from '../home/info-box/welcome-box/welcome-box.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { NotFoundComponent } from '../not-found/not-found.component';

export const routes: Routes = [
  { path: 'leaderboard', component: LeaderboardComponent },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: InfoBoxComponent,
        children: [
          {
            path: '',
            component: WelcomeBoxComponent,
            canActivate: [DenyaccessGuard],
          },
          {
            path: 'login',
            component: LoginBoxComponent,
            canActivate: [DenyaccessGuard],
          },
          {
            path: 'register',
            component: RegisterBoxComponent,
            canActivate: [DenyaccessGuard],
          },
          {
            path: ':url',
            component: WelcomeBoxComponent,
            canActivate: [DenyaccessGuard],
          },
          {
            path: 'u/:id',
            component: UserBoxComponent,
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'u/:id/edit',
            component: UserEditComponent,
            canActivate: [AuthenticationGuard],
          },
          {
            path: 'u/:id/to/:url',
            component: UserBoxComponent,
            canActivate: [AuthenticationGuard],
          },
        ],
      },
    ],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];
