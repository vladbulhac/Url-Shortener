import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css'],
})
export class LoginBoxComponent implements OnInit {
  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  public errorService:ErrorService;
  private router: Router;

  constructor(router:Router,errorService:ErrorService) {
    this.router=router;
    this.errorService=errorService;
  }

  ngOnInit(): void {}

  onLogin(): void {
    const email=this.emailInput.nativeElement.value;
    const password=this.passwordInput.nativeElement.value;

    //login request to server

    
  /*   if(successfulLogin)
    {
      //id must be number??
      const id:string='id1251';
      this.router.navigate(['/u',id]);
    }
    else
    {
      const error:Error={};
      this.errorService.setError(error);
    } */

  }
}
