import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { Url } from '../models/Url.model';
import { UrlService } from '../services/url-service.service';
import {leaderboardDTO} from '../DTOs/leaderboard.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  private errorService:ErrorService;
  private urlService:UrlService;
  private router:Router;
  public urls:Url[];

  constructor(errorService:ErrorService,urlService:UrlService,router:Router) {
    this.errorService=errorService;
    this.urlService=urlService;
    this.router=router;
    this.urls=[] as Url[];
   }

  ngOnInit(): void {
    this.urlService.getLeaderboard().subscribe((response:leaderboardDTO)=>{
      this.urls=response.data.urls;
    },error=>{
      this.errorService.setError({
        errorCode: error.error.error.errorCode,
        message: error.error.error.message,
      });
    });
  }
  setUrlInput(url:string){
    this.urlService.setUrl(url);
      this.router.navigate([`${url}`]);
  }
}
