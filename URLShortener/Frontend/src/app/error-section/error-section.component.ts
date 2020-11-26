import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { Error } from '../models/Error.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-section',
  templateUrl: './error-section.component.html',
  styleUrls: ['./error-section.component.css'],
})
export class ErrorSectionComponent implements OnInit, OnDestroy {
  public error: Error=null;
  public errorService: ErrorService;
  private errorSubscription:Subscription;

  constructor(errorService: ErrorService) {
    this.errorService=errorService;
  }

  ngOnInit(): void {
   this.errorSubscription= this.errorService.errorSubject.subscribe((error:Error)=>{
      this.error=error;
    });
  }

  ngOnDestroy():void{
    this.errorSubscription.unsubscribe();
  }

  clearError(): void {
    this.error = null;
  }
}
