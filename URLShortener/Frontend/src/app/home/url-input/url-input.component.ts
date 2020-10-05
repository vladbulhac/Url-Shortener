import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/error.service';
import { User } from 'src/app/models/User.model';
import {UrlService} from '../../url-service.service';
import {UserService} from '../../user-service.service';
@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.css']
})
export class UrlInputComponent implements OnInit,OnDestroy {
  @ViewChild('urlinput') url_input:ElementRef;
  public urlService:UrlService;
  public userService:UserService;
  private errorService:ErrorService;
  public isCreateShortUrl:boolean;
  private urlSubscription:Subscription;
  private userSubscription:Subscription;
  private user:User;

  constructor(urlservice:UrlService,userService:UserService,errorService:ErrorService) { 
    this.isCreateShortUrl=false;
    this.urlService=urlservice;
    this.userService=userService;
  }

  ngOnInit(): void {
    this.urlSubscription=this.urlService.urlSubject.subscribe((url)=>{
      this.url_input.nativeElement.value=url;
    });
    this.userSubscription=this.userService.userSubject.subscribe((user)=>{
      this.user=user;
    });
  }

  ngOnDestroy():void{
    this.urlSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  public getUrl():void{
    if(this.user!== null && this.user!==undefined){
      //set in user 
      this.userService.setUser(this.user);
    const requestUrl=this.url_input.nativeElement.value;
    //request for url;

     //on error errorSerivece.sendError()
    }
  }

  public createUrl():void{
    const requestUrl=this.url_input.nativeElement.value;
    //request to create short url

    //on error errorSerivece.sendError()
  }
}
