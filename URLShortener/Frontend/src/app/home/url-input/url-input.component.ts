import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urlDTO } from 'src/app/DTOs/url.dto';
import { ErrorService } from 'src/app/services/error.service';
import { User } from 'src/app/models/User.model';
import { UrlService } from '../../services/url-service.service';
import { UserService } from '../../services/user-service.service';
import { Url } from 'src/app/models/Url.model';

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.css'],
})
export class UrlInputComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('urlinput') url_input: ElementRef;
  @ViewChild('customInput') custom_input: ElementRef;
  public user: User;
  public toggleStatus: boolean;
  public urlService: UrlService;
  public userService: UserService;
  private errorService: ErrorService;
  private urlSubscription: Subscription;
  private userSubscription: Subscription;
  private route: ActivatedRoute;
  private router: Router;

  constructor(
    urlservice: UrlService,
    userService: UserService,
    errorService: ErrorService,
    route: ActivatedRoute,
    router: Router
  ) {
    this.toggleStatus = false;
    this.urlService = urlservice;
    this.userService = userService;
    this.errorService = errorService;
    this.route = route;
    this.router = router;
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    this.urlSubscription = this.urlService.urlSubject.subscribe((url) => {
      this.url_input.nativeElement.value = url;
    });
  }

  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  public toggleMode(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  public urlRequest(url?: string): void {
    let requestUrl: string;
    if (url) requestUrl = url;
    else requestUrl = this.url_input.nativeElement.value;
    if (requestUrl !== undefined && requestUrl !== null && requestUrl !== '') {
      if (this.toggleStatus === false) this.getUrl(requestUrl);
      else this.createUrl(requestUrl);
    }
  }

  private getUrl(requestUrl: string): void {
    if (this.user !== undefined && this.user !== null) {
      this.userService.redirectIfTokenExpired();

      this.urlService
        .getUrlAuthenticated(`${this.user._id}/${requestUrl}`)
        .subscribe(
          (data: urlDTO) => {
            this.user.urlHistory.push(data.data.url);
            this.userService.setUser(this.user);
            document.location.href = data.data.url;
          },
          (error) => {
            console.log(error);
            this.errorService.setError({
              errorCode: error.error.error.errorCode,
              message: error.error.error.message,
            });
          }
        );
    } else {
      this.urlService.getUrl(requestUrl).subscribe(
        (data: urlDTO) => {
          document.location.href = data.data.url;
        },
        (error) => {
          this.errorService.setError({
            errorCode: error.error.error.errorCode,
            message: error.error.error.message,
          });
        }
      );
    }
  }

  public createUrl(requestUrl: string): void {
    if (this.user !== undefined && this.user !== null) {
      this.userService.redirectIfTokenExpired();

      const customUrl = this.custom_input.nativeElement.value;
      const requestBody = {
        url: requestUrl,
      };
      if (customUrl) requestBody['custom'] = customUrl;

      this.urlService
        .createUrlAuthenticated(this.user._id, requestBody)
        .subscribe(
          (data: urlDTO) => {
            if(customUrl)
              {const urlData:Url={
                shortUrl:customUrl,
                trueUrl:data.data.url,
                accessNumber:1,
              };
              this.user.customUrls.push(urlData);
              this.userService.setUser(this.user);
            }
            this.url_input.nativeElement.value = data.data.url;
            this.toggleMode();
          },
          (error) => {
            this.errorService.setError({
              errorCode: error.error.error.errorCode,
              message: error.error.error.message,
            });
          }
        );
    } else {
      this.urlService.createUrl(requestUrl).subscribe(
        (data: urlDTO) => {
          this.url_input.nativeElement.value = data.data.url;
          this.toggleMode();
        },
        (error) => {
          this.errorService.setError({
            errorCode: error.error.error.errorCode,
            message: error.error.error.message,
          });
        }
      );
    }
  }
}
