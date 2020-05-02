import { Injectable, NgZone, Output } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CredentialData } from './prototypes/credential-prototype'
import { LoginService } from './login.service';
import { PIPEDAListService } from './pipedalist.service';
import { SubscriptionData } from './prototypes/subscription-data-interface'


@Injectable({
  providedIn: "root",
})

/**
 * Generates and handles list of subscriptions found in emails
 * @class
 */
export class SubscriptionListService {
  private dataSrc: string = null; // Google Drive API will provide a way to access email zip file, for now treated as a url
  private subscriptions: Object = {}; //Array of Subscription Objects
  private emailData: string = null;
  private emailPack: Array<string> = [];
  public googleAuth: gapi.auth2.GoogleAuth;
  private avoidAddresses: Array<String> = [
    "google.com",
    "gmail.com",
    "youtube.com",
    "hotmail.com",
    "yahoo.com",
    "outlook.com",
    "docs.google.com",
  ];

  /**
   * Creates Subscripton List class
   * @constructor
   * @param { HttpClient } _http - HttpClient Object to handle HTTP requests
   */
  constructor(
    private _http: HttpClient,
    private _newSub: SubscriptionService,
    private _login: LoginService,
    private zone: NgZone
  ) {}

  /**
   * Initiates Google Auth Service to access Google Drive API
   */
  initClient() {
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

  searchForTestFile(token:CredentialData) {
    gapi.auth.setToken({access_token: token.credential.accessToken});
    console.log(this.googleAuth.isSignedIn);
    gapi.client.drive.files.list({
      q:"name='TestFile.mbox'",
      pageSize: 1000,
      fields: 'nextPageToken, files(id, name)',
    }).then((res) => {
      const files = res.result.files;
      this.setUploadSrc(files[0].id);
    },
    (err) => {
      console.log('The API returned an error: ' + err);
      return
    });
  }

  /**
   * Checks if data resource has been uploaded
   */
  isDataUploaded() {
    let status: Boolean;
    //Call external function to check whether an upload has occured
    if (this.dataSrc == "null") {
      status = false;
    } else {
      status = true;
    }
    return status;
  }

  /**
   * Sets fileId for email data, begins file scan by calling scanEmail();
   * @param { string } - fileId: Google Drive API file ID to retrieve email data from
   */
  setUploadSrc(fileId:string) {
    // Get email data: FILE READ
    this.dataSrc=fileId;
    let request = gapi.client.drive.files.get({
      'fileId': fileId,
      alt:'media'
    }).then(res=>{
      this.emailData = res.body;
      this.scanEmail();
    }, err => {
      console.error("An error occurred fetching the email data file: " + err)
    });
    //.execute(resp=>{});
    //responseType="text"
    /*const tokenHeader = new HttpHeaders().set("Authorization", "Bearer " + gapi.auth.getToken().access_token).set("Accept", "application/json");
    this._http.get("https://www.googleapis.com/drive/v2/files/" + this.dataSrc + "?key=" + "AIzaSyD8YHcpEJKBFnrTt4DXftDVdsOw9XGYLrg/alt=media", {  headers: tokenHeader }).subscribe(
      (data) => {
        //this.emailData = data;
        //console.log(this.emailData.slice(0,1000));
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );*/

  }

  /**
   * Scans emails found at source URL and adds subscriptions to subscription list
   */
  scanEmail() {
    //Analyze emails: STRING MANIPULATION
    this.splitMail();
    let emailAddresses: Array<String> = [];
    for (let email of this.emailPack) {
      let index = email.search("From: ");
      let serviceName: String = email
        .slice(
          index + "From: ".length,
          index + email.slice(index, index + 1000).search("\n")
        )
        .trim();
      /*if (serviceName.search(">") == -1) {
        serviceName = email.slice(index + (email.slice(index, index + 1000)).search('\n'), email.slice((email.slice(index, index + 5000)).search('\n'), 1000).search('\n'));
      }
      let mySlice = email.slice(email.slice(index, index+1000).search("\n"), -1);
      let iteration = 0;
      while (serviceName.search(">") == -1 && iteration < 10) {
        mySlice = email.slice(email.slice(index, index + 1000).search("\n"), -1);
        index = mySlice.search("From: ");
        serviceName = email.slice(index + "From: ".length, index + (email.slice(index, index + 1000)).search('\n')).trim();
        iteration++;
      }*/
      if (serviceName.search(">") != -1) {
        let address: String = "";
        let myArray = [];
        let firstDot = false;
        for (let i = serviceName.search(">") - 1; i >= 0; i--) {
          if (serviceName[i] != "." && serviceName[i] != "@") {
            myArray.unshift(serviceName[i]);
          } else if (!firstDot) {
            firstDot = true;
            myArray.unshift(serviceName[i]);
          } else {
            break;
          }
        }
        address = myArray.join("");
        let name = address.slice(0, address.search(/\./));

        /*if (name.startsWith("email")) {
          name = name.slice("email".length - 1, -1);
        } else if (name.endsWith("email")) {
          name = name.slice(0, name.search("email"));
        } else if (name.startsWith("mail")) {
          name = name.slice("mail".length - 1, -1);
        } else if (name.endsWith("mail") && name!="knowmail") {
          name = name.slice(0, name.search("mail"));
        }*/
        if (
          this.subscriptions == {} ||
          (Object.keys(this.subscriptions).indexOf(name) == -1 &&
            this.avoidAddresses.indexOf(address) == -1)
        ) {
          this._newSub.searchForCompany(address);
          this.subscriptions[name] = this._newSub;
          console.log(this._newSub.getData());
        }
      }
    }
    console.log(this.subscriptions);
  }

  /**
   * Splits given email data string into array of emails
   */
  splitMail(): void {
    let emailLines: Array<string> = this.emailData.split("\n");
    let newMail = "";
    let emailCount = 0;
    for (let i = 0; i < emailLines.length; i++) {
      if (emailLines[i].search("X-GM-THRID: ") !== -1) {
        if (emailCount == 0) {
          newMail = emailLines[i - 1].trim();
          newMail = newMail.concat("\n" + emailLines[i].trim());
          emailCount += 1;
        } else {
          newMail = newMail.slice(
            0,
            newMail.length -
              (emailLines[i].length + emailLines[i - 1].length) +
              1
          );
          this.emailPack.push(newMail);
          newMail = newMail = emailLines[i - 1].trim();
          newMail = newMail.concat("\n" + emailLines[i].trim());
          emailCount += 1;
        }
      } else if (emailCount != 0) {
        newMail = newMail.concat("\n" + emailLines[i].trim());
      }
    }
    emailCount += 1;
  }

  /**
   * Returns a specified subscription on subscriptions array
   * @param { Number } id - Index on array this.subscriptions of the target subscription
   * @returns { SubscriptionService } Returns a subscription object
   */
  getSubscription(id) {
    return this.subscriptions[id];
  }

  /**
   * Downloads PIPEDA email template to user desktop
   */
  downloadTemplate() {
    //Initiate download
  }
}

/**
 * DATATYPE LIMITS:
 * #Primitive Datatypes
 * Number: Holds integers and floating point numbers (decimals) of max size 8 bytes (64 bits)
 *                                                   from -(2 x 10^53 - 1) to (2 x 10^53 - 1)
 * BigInt: Holds ONLY integer values, has no predefined limit on size
 * String: Immutable set of characters with no set max size, but each character is 2 bytes (16 bit element)
 * Symbol: Anonymous, unique value that allows for variables to be absolutely unique. Essentially, an exclusively unique identifier.
 *                                                  No officially documented size in memory for a Symbol.
 * Boolean: Holds true or false, no official documentation information on memory usage, but stack overflow says 4 bytes
 * Undefined: Non-writable type, can only have the value "undefined"
 *
 * #Data Structures and other types
 * Object: No predefined size of datatype. Holds keys and values.
 * Array (is of type Object): List of data. Element datatypes do not have to match. Size is dynamic.
 * Null: Holds "nothing": not 0, not "", nothing.
 * Any: Special Typescript datatype that serves as a placeholder when compiler can't auto-detect a type.
 */
