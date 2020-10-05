import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userSubject=new Subject<User>();
  private user:User=
{
    _id: '1251asbdsf11',
    email: 'helloTest@gmail.com',
    urlHistory: [
      'google.com',
      'youtube.com',
      'reddit.com',
      'yahoo.com'
    ],
    customUrls: [
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      {
        shortUrl: 'myWishList',
        trueUrl: 'emag.ro?1251241sagasg13gt0afaiHA#?safa',
        accessNumber: 2,
      },
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      { shortUrl: 'myWishList', trueUrl: 'emag.ro', accessNumber: 2 },
      { shortUrl: 'myCustom1', trueUrl: 'amazon.com', accessNumber: 10 },
      { shortUrl: 'myWishList', trueUrl: 'emag.ro', accessNumber: 2 },
    ],
  }; 
  constructor() { 
    this.userSubject.next(this.user);
  }

  deleteUser():void{
    this.user=null;
  }
  
  getUser():User{
    return this.user;
  }

setUser(user:User):void{
  if(user){
    //request for user
    const resUser=null;
    this.user=resUser;
    this.userSubject.next(this.user);
  }
    else{
  //request for user to api
   const reqUser:User={_id:"212agas1",email:"testEmail@com",customUrls:[],urlHistory:[]};
    this.userSubject.next(reqUser);
    }
  }
}
