import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { Url } from '../models/Url.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  private errorService:ErrorService;
  private urls:Url[];

  constructor(errorService:ErrorService) {
    this.errorService=errorService;
    this.urls=[];
   }

  ngOnInit(): void {
    //request from backend api top 10 error if not possible
  }
}
