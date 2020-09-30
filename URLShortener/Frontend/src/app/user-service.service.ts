import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userSubject=new Subject<User>();

  constructor() { 
  }

setUser(user?:User):void{
  if(user)
    this.userSubject.next(user);
    else{
  //request for user to api
   const reqUser:User={_id:"212agas1",email:"testEmail@com",customUrls:[],urlHistory:[]};
    this.userSubject.next(reqUser);
    }
  }
}
