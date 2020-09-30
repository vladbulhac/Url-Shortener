import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Error } from '../models/Error.model';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-error-section',
  templateUrl: './error-section.component.html',
  styleUrls: ['./error-section.component.css'],
})
export class ErrorSectionComponent implements OnInit {
  public error: Error;
  public errorService: ErrorService;

  constructor(errorService: ErrorService) {
    this.error = { statusCode: 404, message: 'Could not find this url!' };
    this.errorService=errorService;
  }

  ngOnInit(): void {
    this.errorService.errorSubject.subscribe((error:Error)=>{
      this.error=error;
    });
  }

  clearError(): void {
    this.error = null;
    console.log(this.error);
  }
}
