import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from 'src/app/error.service';
import { UrlService } from 'src/app/url-service.service';
import { User } from '../../../models/User.model';
@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css'],
})
export class UserBoxComponent implements OnInit {
  public toggle_customs: boolean;
  public toggle_history: boolean;
  public user: User = {
    _id: '1251asbdsf11',
    email: 'helloTest@gmail.com',
    urlHistory: [
      'google.com',
      'youtube.com',
      'aleluia@jesus.world',
      'testing@go',
      'patrocle.org',
    ],
    customUrls: [
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      {
        shortUrl: 'myWishList',
        trueUrl: 'emag.ro?1251241sagasg13gt0afaiHA#?safa',
        accessNumber: 2,
      },
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      { shortUrl: 'myWishList', trueUrl: 'emag.ro', accessNumber: 2 },
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      { shortUrl: 'myWishList', trueUrl: 'emag.ro', accessNumber: 2 },
    ],
  };
  public urlService: UrlService;
  private router: Router;
  private route: ActivatedRoute;

  constructor(router: Router, route: ActivatedRoute, urlService: UrlService) {
    this.router = router;
    this.route = route;
    this.urlService = urlService;
    this.toggle_customs = false;
    this.toggle_history = false;
  }

  ngOnInit(): void {}

  setUrlInput(url: string) {
    this.urlService.setUrl(url);
  }
  toEditComponent(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  toggleCustoms(): void {
    this.toggle_customs = !this.toggle_customs;
  }
  toggleHistory(): void {
    this.toggle_history = !this.toggle_history;
  }
}
