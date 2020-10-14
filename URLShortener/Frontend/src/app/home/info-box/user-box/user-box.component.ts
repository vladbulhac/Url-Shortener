import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../services/error.service';
import { User } from '../../../models/User.model';
import { UrlService } from '../../../services/url-service.service';
import { UserService } from '../../../services/user-service.service';
import { urlDTO } from 'src/app/DTOs/url.dto';
@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css'],
})
export class UserBoxComponent implements OnInit,OnDestroy,OnChanges {
  public toggle_customs: boolean;
  public toggle_history: boolean;
  public user: User;
  private urlService: UrlService;
  private userService:UserService;
  private errorService:ErrorService;
  private subscription:Subscription;
  private router: Router;
  private route: ActivatedRoute;
  private id:string;

  constructor(router: Router, route: ActivatedRoute, urlService: UrlService,userService:UserService,errorService:ErrorService) {
    this.router = router;
    this.route = route;
    this.urlService = urlService;
    this.userService=userService;
    this.errorService=errorService;
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
      const url=params['url'];
      if( this.user===null || this.user===undefined || this.user._id!==this.id)
        this.router.navigate(['']);

      if(url){
        this.urlService.getUrlAuthenticated(url).subscribe((data:urlDTO)=>{
          document.location.href=data.data.url;
      },(error)=>{
        this.errorService.setError({
          errorCode: error.error.error.errorCode,
          message: error.error.error.message,
        });
    });}
  });
  }

  ngOnChanges():void{
    if(this.user===null || this.user===undefined)
      this.router.navigate(['/login']);
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
  logout():void{
    this.userService.logoutUser();
  }
  toDeleteAccount():void{
    this.userService.deleteUser().subscribe((data)=>{
      this.user=null;
      this.userService.setUser(null);
    },(error)=>{
      this.errorService.setError({
        errorCode: error.error.error.errorCode,
        message: error.error.error.message,
      });
    });

    this.router.navigate(['']);
  }
}
