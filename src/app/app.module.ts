import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { EmailUploadComponent } from "./email-upload/email-upload.component";
import { SubscriptionListComponent } from "./subscription-list/subscription-list.component";

import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginPageComponent,
    AboutPageComponent,
    NotFoundPageComponent,
    DashboardPageComponent,
    EmailUploadComponent,
    SubscriptionListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(
      environment.firebase,
      "angular-auth-firebase"
    ),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
/**
 * Controls all views inside app: Angular Autogenerated class
 * @class
 */
export class AppModule {}
