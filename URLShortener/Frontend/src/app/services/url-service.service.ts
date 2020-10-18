import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
    return this.httpClient.post('http://localhost:55123/v1/urls',{data:{url:url}});
  }

  public getUrl(url:string){
      return this.httpClient.get(`http://localhost:55123/v1/urls/${url}`);
  }

  public createUrlAuthenticated(id:string,request:{url:string,custom?:string}){
    const requestBody={
      data:request
    };
    return this.httpClient.post(`http://localhost:55123/v1/urls/u/${id}`,requestBody);
  }

  public getUrlAuthenticated(url:string,id:string)
  {
    return this.httpClient.get(`http://localhost:55123/v1/urls/${url}/u/${id}`);
  }

  public AddHttpIfAbsent(url:string):string
  {
    let pattern=/^((https:\/\/)|(http:\/\/))/i;
    if(url.match(pattern))
      return url;
    return 'https://'+url;
  }

}
