import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
/**
 * Controls View of Navbar and calls login service for authentication
 * @class
 * @implements { OnInit }
 */
export class NavbarComponent implements OnInit {
  /**
   * Creates LoginPageComponent class and loads backend for login
   * @constructor
   * @param { LoginService } _loginService - Connects page view to backend tools for handling login events
   */
  constructor(private _loginService: LoginService) {}

  /**
   * Loads any scripts needed for Navbar
   */
  ngOnInit(): void {}

  /**
   * Calls sign in method from backend LoginService object
   */
  signIn() {
    console.log(this._loginService.login());
  }

  /**
   * Calls sign out method from backend LoginService object
   */
  signOut() {
    this._loginService.logout();
  }

  /**
   * Calls backend LoginService object method to check whether a user is logged in
   * @returns { Boolean } Returns state of login (true if logged in, false if not)
   */
  isLoggedIn() {
    return this._loginService.isLoggedIn();
  }

  /**
   * Calls getter method from backend LoginService object to receive user data
   * @returns { Object } Returns an object which includes name, profile picture, and email data for user
   */
  getData() {
    return this._loginService.getUserData();
  }
}
