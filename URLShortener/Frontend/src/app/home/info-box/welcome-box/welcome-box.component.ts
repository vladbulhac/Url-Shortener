import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome-box',
  templateUrl: './welcome-box.component.html',
  styleUrls: ['./welcome-box.component.css']
})
export class WelcomeBoxComponent implements OnInit {
  private router:Router;

  constructor(router:Router) {
      this.router=router;
   }

  ngOnInit(): void {
  }

  toLoginComponent()
  {
    this.router.navigate(['/login']);
  }

  toRegisterComponent()
  {
    this.router.navigate(['register']);
  }
}
