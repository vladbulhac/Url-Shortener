import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/error.service';
import { Error } from 'src/app/models/Error.model';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/user-service.service';

@Component({
  selector: 'app-register-box',
  templateUrl: './register-box.component.html',
  styleUrls: ['./register-box.component.css']
})
export class RegisterBoxComponent implements OnInit,OnDestroy {
  private errorService:ErrorService;
  private userService:UserService;
  private user:User;
  private router:Router;
  private error:Error;
  private errorSubscription:Subscription;
  public registerForm:FormGroup;

  constructor(router:Router,errorService:ErrorService,userService:UserService) {
    this.router=router;
    this.errorService=errorService;
    this.userService=userService;
   }

  ngOnInit(): void {
    this.errorSubscription=this.errorService.errorSubject.subscribe((error:Error)=>{
      this.error=error;
    });
    this.registerForm=new FormGroup({
                'email':new FormControl(null,[Validators.email,Validators.required]),
                'password':new FormControl(null,[Validators.required,Validators.minLength(7)]),
                'confirmpassword':new FormControl(null,[Validators.required,Validators.minLength(7)])
  },{
    validators:[this.passwordCloneValidator.bind(this)]
  });
}

ngOnDestroy():void{
  this.errorSubscription.unsubscribe();
}

  private passwordCloneValidator(group:FormGroup):{[s:string]:boolean}{
    if(group.get('confirmpassword').value!== group.get('password').value)
      return {notMatchingPasswords:true};

    
    return null;
  }

  onSubmit():void{
    const email=this.registerForm.value['email'];
    const password=this.registerForm.value['password'];
    const newUser={
      "email":email,
      "password":password
    }

      //register
      this.userService.setUser(newUser);
      if(this.error)
        alert("Could not register you right now, check the error message!");
      else{
      const id:string='id12512';
      //id must be number???
      this.router.navigate(['/login']);
      }
    }
  }
