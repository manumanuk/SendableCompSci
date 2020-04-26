import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router'

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
/**
 * Controls View of Login Page and calls login service for authentication
 * @class
 * @implements { OnInit }
 */
export class LoginPageComponent implements OnInit {
  /**
   * Creates LoginPageComponent class and loads backend for login
   * @constructor
   * @param { LoginService } _loginService - Connects page view to backend tools for handling login events
   * @param { Router } _router - Object imported from Angular Router library, responsible for pageview navigation
   */
  constructor(private _loginService: LoginService, private _router: Router) {}

  /**
   * When login page is loaded, checks if user has already logged in
   */
  ngOnInit(): void {}

  /**
  * Calls sign in method from backend LoginService object
  */
  signIn() {
    this._loginService.login();
  }

  /**
   * Retrieves login status
   */
  getLoginStatus() {
    return this._loginService.isLoggedIn();
  }
}
