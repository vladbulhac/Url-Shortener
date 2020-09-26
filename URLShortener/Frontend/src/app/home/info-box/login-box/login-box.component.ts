import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css'],
})
export class LoginBoxComponent implements OnInit {
  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @Output() error=new EventEmitter<Error>();
  private router: Router;

  constructor(router:Router) {
    this.router=router;
  }

  ngOnInit(): void {}

  onLogin(): void {
    const email=this.emailInput.nativeElement.value;
    const password=this.passwordInput.nativeElement.value;

    //login request to server

    /*
    if(successfulLogin)
    {
      //id must be number??
      const id:string='id1251';
      this.router.navigate(['/u',id]);
    }*/
  }
}
