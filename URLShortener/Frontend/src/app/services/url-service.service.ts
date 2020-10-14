import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService{
  public urlSubject=new Subject<string>();
  private httpClient:HttpClient;

  constructor(httpClient:HttpClient) {
    this.httpClient=httpClient;
   }

   public setUrl(url:string):void{
    this.urlSubject.next(url);
  }

  public createUrl(url:string){
    return this.httpClient.post('http://localhost:55123/',{data:{url:url}});
  }

  public getUrl(url:string){
      return this.httpClient.get(`http://localhost:55123/${url}`);
  }

  public createUrlAuthenticated(id:string,request:{url:string,custom?:string}){
    const requestBody={
      data:request
    };
    return this.httpClient.post(`http://localhost:55123/u/${id}`,requestBody);
  }

  public getUrlAuthenticated(codedIdAndUrl:string)
  {
    return this.httpClient.get(`http://localhost:55123/u/${codedIdAndUrl}`);
  }

}
