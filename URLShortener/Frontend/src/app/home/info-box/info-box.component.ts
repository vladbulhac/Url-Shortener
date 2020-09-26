import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {
  public route:ActivatedRoute;
  public user:User;
  public token:string='';
  public isWelcomeBox:boolean;
  public isUserBox:boolean;
  public isLoginBox:boolean;
  public isRegisterBox:boolean;

  constructor() {
      this.isWelcomeBox=true;
   }

  ngOnInit(): void {
  }

  public selectedUrl(url:string):void{

  }

}
