import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-register-box',
  templateUrl: './register-box.component.html',
  styleUrls: ['./register-box.component.css']
})
export class RegisterBoxComponent implements OnInit {
  @ViewChild('emailInput') emailInput:ElementRef;
  @ViewChild('passwordInput') passwordInput:ElementRef;
  @ViewChild('passwordInputAgain') passwordInputAgain:ElementRef;
  private errorService:ErrorService;
  private router:Router;

  constructor(router:Router,errorService:ErrorService) {
    this.router=router;
    this.errorService=errorService;
   }

  ngOnInit(): void {
  }

  onRegister():void{
    const email=this.emailInput.nativeElement.value;
    const password=this.passwordInput.nativeElement.value;
    const passwordAgain=this.passwordInputAgain.nativeElement.value;

    if(password)
    {
      //register
      const id:string='id12512';
      //id must be number???
      this.router.navigate(['/u',id]);
    }

    /* if(error)
      this.errorService.setError(error); */
  }
}
