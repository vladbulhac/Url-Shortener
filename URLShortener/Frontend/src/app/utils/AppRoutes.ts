import { Routes } from '@angular/router';
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
          { path: '', component: WelcomeBoxComponent },
          { path: 'login', component: LoginBoxComponent },
          { path: 'register', component: RegisterBoxComponent },
          { path: ':url', component: WelcomeBoxComponent },
          {path:'u/:id/edit',component:UserEditComponent},
          {
            path: 'u/:id',
            component: UserBoxComponent,
            children: [
              { path: 'to/:url', component: UserBoxComponent },
            ],
          }
        ],
      },
    ],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];
