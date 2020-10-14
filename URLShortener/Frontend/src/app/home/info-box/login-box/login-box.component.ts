import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';
import { Error } from 'src/app/models/Error.model';
import { User } from 'src/app/models/User.model';
import {loginDTO} from 'src/app/DTOs/login.dto';
import { UserService } from 'src/app/services/user-service.service';
import { Url } from 'src/app/models/Url.model';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css'],
})
export class LoginBoxComponent implements OnInit,OnDestroy {
  private errorService:ErrorService;
  private userService:UserService;
  private userSubscription:Subscription;
  private errorSubscription:Subscription;
  private router: Router;
  private user:User;
  private error:Error;
  public loginForm:FormGroup;

  constructor(router:Router,errorService:ErrorService,userService:UserService) {
    this.router=router;
    this.errorService=errorService;
    this.userService=userService;
  }

  ngOnInit(): void {
    this.userSubscription=this.userService.userSubject.subscribe((user:User)=>{
      this.user=user;
    });
    this.errorSubscription=this.errorService.errorSubject.subscribe((error:Error)=>{
      this.error=error;
    });
    this.loginForm=new FormGroup({
        'email':new FormControl(null,[Validators.required,Validators.email]),
        'password':new FormControl(null,[Validators.required,Validators.minLength(7)])
    });
  }

  ngOnDestroy():void{
    this.userSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  onSubmit(): void {
    const email=this.loginForm.value['email'];
    const password=this.loginForm.value['password'];
    const getUser={
      'email':email,
      'password':password
    };

    this.userService.loginUser(getUser).subscribe((data:loginDTO)=>{
      this.user = {
        _id: data['data'].loginData.user._id,
        email: data['data'].loginData.user.email,
        urlHistory: data['data'].loginData.user.urlHistory,
        customUrls:[],
        token: data['data'].loginData.token,
        tokenExpiresIn:new Date(new Date().getTime()+600000)
      };
      console.log(data.data.loginData.user.customUrls);
      if(data.data.loginData.user.customUrls)
      for(let url of data.data.loginData.user.customUrls)
      {
        let customUrl:Url={
          shortUrl:url.shortUrl,
          trueUrl:url.trueUrl,
          accessNumber:url.accessNumber
        }
          this.user.customUrls.push(customUrl);
      }
      this.userService.setUser(this.user);
      //this.userService.autoLogout(this.user.tokenExpiresIn.getTime()*1000);
      this.router.navigate(['/u',this.user._id]);
    },(error)=>{
      this.errorService.setError({
        errorCode: error.error.error.errorCode,
        message: error.error.error.message,
      });
      alert('Could not login you right now, check the error message!');
    });
  }
}
