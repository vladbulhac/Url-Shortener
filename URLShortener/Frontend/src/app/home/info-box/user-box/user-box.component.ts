import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/error.service';
import { UrlService } from 'src/app/url-service.service';
import { UserService } from 'src/app/user-service.service';
import { User } from '../../../models/User.model';
@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css'],
})
export class UserBoxComponent implements OnInit,OnDestroy {
  public toggle_customs: boolean;
  public toggle_history: boolean;
  public user: User;
  private urlService: UrlService;
  private userService:UserService;
  private subscription:Subscription;
  private router: Router;
  private route: ActivatedRoute;
  private id:string;

  constructor(router: Router, route: ActivatedRoute, urlService: UrlService,userService:UserService) {
    this.router = router;
    this.route = route;
    this.urlService = urlService;
    this.userService=userService;
    this.toggle_customs = false;
    this.toggle_history = false;
    this.user=this.userService.getUser();
  }

  ngOnInit(): void {
    this.subscription=this.userService.userSubject.subscribe((user:User)=>{
      this.user=user;
    });

    this.route.params.subscribe((params:Params)=>{
      this.id=params['id'];
      if(this.user._id!==this.id)
        this.router.navigate(['']);
    });
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

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
  toLogout():void{
    this.userService.deleteUser();
    this.router.navigate(['']);
  }
}
