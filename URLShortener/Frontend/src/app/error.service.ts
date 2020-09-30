import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Error } from './models/Error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  public errorSubject=new Subject<Error>();
  constructor() { }

  setError(error:Error):void{
    this.errorSubject.next(error);
  }
}
