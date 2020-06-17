import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { Observable } from "rxjs";
import { CredentialData } from './prototypes/credential-prototype'

const SCOPES: Array<string> = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.readonly"]

@Injectable({
  providedIn: "root",
})


/**
 * Handles user login events and data using Firebase tools
 * @class
 */
export class LoginService {
  public googleAuth: gapi.auth2.GoogleAuth;
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private credentialData: CredentialData = null;

  /**
   * Creates Observable to listen to user login status and assigns user information to userDetails
   * @constructor
   * @param { AngularFireAuth } _firebaseAuth - Object imported from Firebase library, responsible for login authorization
   * @param { Router } _router - Object imported from Angular Router library, responsible for pageview navigation
   */
  constructor(private _firebaseAuth: AngularFireAuth, private _router: Router) {
    this.user = _firebaseAuth.authState;
    this.credentialData = new CredentialData;

    this.user.subscribe(user => {
      if (user) {
        this.userDetails = user;
        this.credentialData.user=this.userDetails;
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
    return this._firebaseAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider().addScope(SCOPES.join(', '))
      ).then(async (res) => {
        this.credentialData.credential=res.credential;
        this.credentialData.scopes = SCOPES;
        this.credentialData.additionalUserInfo = res.additionalUserInfo;
        this.credentialData.operationType = res.operationType;
        this.credentialData.signInMethod = res.credential.signInMethod;
        this.credentialData.providerId = res.credential.providerId;
        this.credentialData.refreshToken = res.user.refreshToken;
        this.credentialData.tokenType = "Bearer";
        this._router.navigate(["/dashboard"]);
      }, (err) => {
        console.error("A login error has occured: " + err);
      }
      );

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
  isLoggedIn() : boolean {
    let status: boolean;
    if (this.userDetails == null) {
      status = false;
    } else {
      status = true;
    }
    return status;
  }
  /**
   * Creates an Object to hold user's name, email, and profile picture
   * @returns { firebase.User } - Returns user's biographical information
   */
  getUserData() {
    return this.userDetails;
  }

  /**
   * Retrieves important credential data, like access token and refresh token
   * @returns { CredentialData } - credentialData: Credential data associated with Firebase login
   */
  getCredentials() {
    this.refreshCredentials().then((res) => {
      this.credentialData.credential = res.credential;
    });
    return this.credentialData;
  }

  /**
   * Refresh the Firebase login access token
   * @returns { Promise<firebase.auth.UserCredential> } -  Provides a Promise containing access token
   */
  refreshCredentials(): Promise<firebase.auth.UserCredential> {
    if (this.credentialData.credential==null){
      return this.userDetails.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider().addScope(SCOPES.join(', ')));
    } else {
      return this.userDetails.reauthenticateWithCredential(this.credentialData.credential);
    }
  }
   /* return this.userDetails.reauthenticateWithCredential(this.credentialData.credential);
  }*/

  /**
 * Initiates Google Auth Service to access Google Drive API
 */
  initGoogleClient() {
    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", () => {
        return gapi.client
          .init({
            apiKey: "AIzaSyD8YHcpEJKBFnrTt4DXftDVdsOw9XGYLrg",
            clientId:
              "934426938633-6t4rnqdo9n7epqdgjb5hkptvs532upl1.apps.googleusercontent.com",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
            ],
            scope: "https://www.googleapis.com/auth/drive.file",
          })
          .then(() => {
            this.googleAuth = gapi.auth2.getAuthInstance();
            resolve();
          });
      });
    });
  }
}
