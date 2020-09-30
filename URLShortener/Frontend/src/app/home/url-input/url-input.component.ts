import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User.model';
import {UrlService} from '../../url-service.service';
import {UserService} from '../../user-service.service';
@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.css']
})
export class UrlInputComponent implements OnInit {
  @ViewChild('urlinput') url_input:ElementRef;
  @Output() error=new EventEmitter<Error>();
  public urlService:UrlService;
  public userService:UserService;
  public isCreateShortUrl:boolean;
  private urlSubscription:Subscription;
  private userSubscription:Subscription;
  private user:User;

  constructor(urlservice:UrlService,userService:UserService) { 
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

  public getUrl():void{
    if(this.user!== null && this.user!==undefined){
      //set in user 
      this.userService.setUser(this.user);
    const requestUrl=this.url_input.nativeElement.value;
    //request for url;
    }
  }

  public createUrl():void{
    const requestUrl=this.url_input.nativeElement.value;
    //request to create short url
  }
}
