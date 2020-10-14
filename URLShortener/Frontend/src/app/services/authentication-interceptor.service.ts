import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { UserService } from './user-service.service';

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.userService.userSubject.pipe(
      take(1),
      exhaustMap((user) => {
        if(!user) return next.handle(request);

        const headerSettings: { [name: string]: string | string[] } = {};
        for (const key of request.headers.keys())
          headerSettings[key] = request.headers.getAll(key);

        const token = user.token;
        if (token) headerSettings['Authorization'] = 'Bearer ' + token;
        headerSettings['Content-type'] = 'application/json';

        const newHeader = new HttpHeaders(headerSettings);
        const modifiedRequest = request.clone({
          headers: newHeader,
        });

        return next.handle(modifiedRequest);
      })
    );
  }
}
