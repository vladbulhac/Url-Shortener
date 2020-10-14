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
export class DenyaccessGuard implements CanActivate {
  private userService: UserService;
  private router: Router;

  constructor(userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;
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
        if (user) this.router.createUrlTree([`/u/${user._id}`]);
        return true;
      })
    );
  }
}
