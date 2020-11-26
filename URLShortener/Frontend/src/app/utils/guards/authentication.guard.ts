import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../../services/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  private userService: UserService;
  private router: Router;

  constructor(userService: UserService, router: Router) {
    this.router = router;
    this.userService = userService;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.userSubject.pipe(
      take(1),
      map((user) => {
        if (user) return true;
        else return this.router.createUrlTree(['']);
      })
    );
  }
}
