import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

/**
 * @constant
 * @type { Routes } List of URL routes that correspond to Angular components
 */
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'about', component: AboutPageComponent},
  { path: 'dashboard', component: DashboardPageComponent },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
