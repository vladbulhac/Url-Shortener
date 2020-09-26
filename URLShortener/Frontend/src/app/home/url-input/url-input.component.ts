import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.css']
})
export class UrlInputComponent implements OnInit {
  @ViewChild('urlinput') url_input:ElementRef;
  @Output() error=new EventEmitter<Error>();
  public isCreateShortUrl:boolean;

  constructor() { 
    this.isCreateShortUrl=false;
  }

  ngOnInit(): void {
  }

  public getUrl():void{
    const requestUrl=this.url_input.nativeElement.value;
    //request for url;
  }

  public createUrl():void{
    const requestUrl=this.url_input.nativeElement.value;
    //request to create short url
  }
}
