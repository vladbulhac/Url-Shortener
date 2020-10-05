import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { UrlService } from '../url-service.service';
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
