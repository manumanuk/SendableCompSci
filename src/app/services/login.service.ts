import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

//Import Firebase authentication tools
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
//Import Observable to listen in on changes to login status
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
/**
 * Handles user login events and data using Firebase tools
 * @class
 */
export class LoginService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  /**
   * Creates Observable to listen to user login status and assigns user information to userDetails
   * @constructor
   * @param { AngularFireAuth } _firebaseAuth - Object imported from Firebase library, responsible for login authorization
   * @param { Router } _router - Object imported from Angular Router library, responsible for pageview navigation
   */
  constructor(private _firebaseAuth: AngularFireAuth, private _router: Router) {
    this.user = _firebaseAuth.authState;

    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
      } else {
        this.userDetails = null;
      }
    });
  }

  /**
   * Opens Google popup to log user in, navigates to /dashboard page if successful
   * @returns { Promise } - Promise is resolved when user logs in
   */
  login() {
    return this._firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res) => this._router.navigate(["/dashboard"]));
  }

  /**
   * Signs out of Google account and navigates to home page
   */
  logout() {
    this._firebaseAuth.signOut().then((res) => this._router.navigate(["/"]));
  }

  /**
   * Checks if user is logged in
   * @returns { Boolean } status - Returns state of login (true if logged in, false if logged out)
   */
  isLoggedIn() : Boolean {
    let status: Boolean;
    if (this.userDetails == null) {
      status = false;
    } else {
      status = true;
    }
    return status;
  }
  /**
   * Creates an Object to hold user's name, email, and profile picture
   * @returns { Object } myData - Returns user's name, email, and profile picture
   */
  getUserData() {
    let myData = {
      name: this.userDetails.displayName.toString(),
      email: this.userDetails.email,
      photoURL: this.userDetails.photoURL.toString(),
    };
    return myData;
  }
}
