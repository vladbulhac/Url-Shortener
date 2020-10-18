import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ErrorService } from './error.service';
import { User } from '../models/User.model';
import { catchError } from 'rxjs/operators';
import { registerDTO } from '../DTOs/register.dto';
import { Error } from '../models/Error.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userSubject = new BehaviorSubject<User>(null);
  private errorService: ErrorService;
  private httpClient: HttpClient;
  private router: Router;
  private user: User = null;
  private tokenExpirationTimer: any;

  constructor(
    httpClient: HttpClient,
    errorService: ErrorService,
    router: Router
  ) {
    this.httpClient = httpClient;
    this.errorService = errorService;
    this.router = router;
    this.userSubject.next(this.user);
  }

  public deleteUser() {
    localStorage.removeItem('userData');
    return this.httpClient.delete(
      `http://localhost:55123/v1/users/${this.user._id}`
    );
  }

  public getUser(): User {
    return this.user;
  }

  private checkIfTokenExpired(expirationDate?: Date): boolean {
    let tokenExpiration: Date;
    if (expirationDate) tokenExpiration = expirationDate;
    else if (this.user) tokenExpiration = this.user.tokenExpiresIn;
    else return true;
    if (new Date() > tokenExpiration) return true;
    return false;
  }

  public registerUser(user: User) {
    if (user) {
      const requestBody = {
        data: {
          email: user.email,
          password: user.password,
        },
      };

      return this.httpClient.post(
        'http://localhost:55123/v1/users/register',
        requestBody
      );
    }
  }

  public redirectIfTokenExpired(): void {
    if (this.checkIfTokenExpired() === true) {
      this.setUser(null);
      this.router.navigate(['/login']);
    }
  }

  public updateUser(user: {email?:string,password?:string}) {
    const requestBody={
      data:user
    }

    return this.httpClient.put(`http://localhost:55123/v1/users/${this.user._id}`, 
      requestBody,
    );
  }

  public autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      if (this.checkIfTokenExpired(userData.tokenExpiresIn) === false) {
        this.setUser(userData);
        const expirationDuration =
          new Date(userData.tokenExpiresIn).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
        this.router.navigate([`u/${userData._id}`]);
      }
    }
  }

  public autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logoutUser();
      console.log('logout has been called');
    }, expirationDuration);
  }

  public loginUser(user: User) {
    if (user) {
      const requestBody = {
        data: {
          email: user.email,
          password: user.password,
        },
      };

      return this.httpClient.post(
        'http://localhost:55123/v1/users/login',
        requestBody
      );
    }
  }

  public logoutUser(): void {
    this.user = null;
    localStorage.removeItem('userData');
    this.setUser(null);
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
    this.router.navigate(['/login']);
  }

  public setUser(user: User): void {
    this.user = user;
    this.userSubject.next(this.user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
