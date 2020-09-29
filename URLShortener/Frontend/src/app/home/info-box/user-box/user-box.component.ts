import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/User.model';
@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css'],
})
export class UserBoxComponent implements OnInit {
  public user: User = {
    _id:'1251asbdsf11',
    email: 'helloTest@gmail.com',
    urlHistory: ['google.com', 'youtube.com', 'aleluia@jesus.world'],
    customUrls: [
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      {shortUrl: 'myWishList', trueUrl: 'emag.ro', accessNumber: 2 },
    ],
  };
  private router: Router;
  private route: ActivatedRoute;

  constructor(router: Router, route: ActivatedRoute) {
    this.router = router;
    this.route = route;
  }

  ngOnInit(): void {}

  toEditComponent(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
