import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropdownDirective } from './dropdown.directive';
import { ErrorSectionComponent } from './error-section/error-section.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { InfoBoxComponent } from './home/info-box/info-box.component';
import { LoginBoxComponent } from './home/info-box/login-box/login-box.component';
import { RegisterBoxComponent } from './home/info-box/register-box/register-box.component';
import { UserBoxComponent } from './home/info-box/user-box/user-box.component';
import { WelcomeBoxComponent } from './home/info-box/welcome-box/welcome-box.component';
import { UrlInputComponent } from './home/url-input/url-input.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserEditComponent } from './home/info-box/user-box/user-edit/user-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorSectionComponent,
    LoginBoxComponent,
    RegisterBoxComponent,
    WelcomeBoxComponent,
    UserBoxComponent,
    UrlInputComponent,
    InfoBoxComponent,
    HomeComponent,
    LeaderboardComponent,
    DropdownDirective,
    NotFoundComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
