import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService{
  public urlSubject=new Subject<string>();
  constructor() { }

   public setUrl(url:string):void{
    this.urlSubject.next(url);
  }
}
