import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {User} from '../../../models/User.model';
@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css']
})
export class UserBoxComponent implements OnInit {
  public user:User;
  @Output() selectedUrlEmitter=new EventEmitter<string>();
  public selectedUrl:string='';

  constructor() { }

  ngOnInit(): void {
  }

  public urlSelected():void{
    this.selectedUrlEmitter.emit(this.selectedUrl);
  }
}
