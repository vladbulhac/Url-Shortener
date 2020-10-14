import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { urlDTO } from 'src/app/DTOs/url.dto';
import { ErrorService } from 'src/app/services/error.service';
import { UrlService } from 'src/app/services/url-service.service';

@Component({
  selector: 'app-welcome-box',
  templateUrl: './welcome-box.component.html',
  styleUrls: ['./welcome-box.component.css']
})
export class WelcomeBoxComponent implements OnInit {
  private router:Router;
  private urlService:UrlService;
  private errorService:ErrorService;
  private route:ActivatedRoute;

  constructor(router:Router,route:ActivatedRoute,urlService:UrlService,errorService:ErrorService) {
      this.router=router;
      this.route=route;
      this.urlService=urlService;
      this.errorService=errorService;
   }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
        if(params['url'])
       return this.urlService.getUrl(params['url']).subscribe((data:urlDTO)=>{
          document.location.href=data.data.url;
      },(error)=>{
        this.errorService.setError({
          errorCode: error.error.error.errorCode,
          message: error.error.error.message,
        });
      });
    })
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
