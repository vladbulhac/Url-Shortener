import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private userService:UserService;

  constructor(userService:UserService){
    this.userService=userService;
  }
  ngOnInit(){console.log('entered app compontent');
      this.userService.autoLogin();
  }
}
