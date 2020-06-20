import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
/**
 * Controls View of Login Page and calls login service for authentication
 * @class
 * @augments LoginService
 * @implements { OnInit }
 */
export class LoginPageComponent extends LoginService implements OnInit {
  /**
   * EXPLANATION FOR EXTENDING OBJECTS ASSIGNMENT
   * When LoginPageComponent extends LoginService, it inherits all functions of LoginService, like login() and getLoginStatus()
   * This way, a new function like signIn() or getLoginStatus() is not needed to call the LoginService methods, nor is a separate
   * instance of LoginService required. This allows us to change the invocations of LoginPageComponent methods inside of
   * login-page.component.html to directly reference the LoginService methods.
   *
   * Where is the instance of this function created?
   * Angular automatically creates an instance of this function when the LoginPageComponent is loaded. When this occurs, the LoginService
   * methods are also loaded (as part of LoginPageComponent) since LoginPageComponent extends the class
   */

  /**
   * When login page is loaded, checks if user has already logged in
   */
  ngOnInit(): void {}
}
