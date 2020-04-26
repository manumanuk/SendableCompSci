import { Injectable } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { HttpClient } from '@angular/common/http';
import { SubscriptionData } from './subscription-data-interface'
import { PIPEDAListService } from './pipedalist.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: "root",
})

/**
 * Generates and handles list of subscriptions found in emails
 * @class
 */
export class SubscriptionListService {
  private dataSrc: string = null; // Google Drive API will provide a way to access email zip file, for now treated as a url
  private subscriptions:Object = { }; //Array of Subscription Objects
  private emailData: string = null;

  /**
   * Creates Subscripton List class
   * @constructor
   * @param { HttpClient } _http - HttpClient Object to handle HTTP requests
   */
  constructor(private _http: HttpClient, private _newSub:SubscriptionService) {}

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
   * Sets the source for where to retrieve email data from: will be dependent upon Google Drive API, is a string for now
   */
  setUploadSrc() {
    //let token = localStorage.getItem('token');
    //const drive = google.drive({version: 'v3', token});
    // Get email data: FILE READ
    this.dataSrc = "assets/sampleEmailData.txt";
    this._http.get(this.dataSrc, { responseType: "text" }).subscribe(
        (data) => {
          this.emailData = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * Scans emails found at source URL and adds subscriptions to subscription list
   */
  scanEmail () {
    //Analyze emails: STRING MANIPULATION
    let emails: Array<string> = this.emailData.split("Email");
    for (let email of emails) {
      let emailLines: Array<string> = email.split("\n");
      if (email.search("subscribe") !== -1) {
        let sender:string = emailLines[2].slice("Sender: ".length - 1, -1);
        //CONVERTING STRING TO NUMBER
        let date:number = parseInt(emailLines[1].slice("Date: ".length -1, -1));
        // Date to be used later
        console.log(date);
        if (Object.keys(this.subscriptions).find(input => {return input==sender;}) == undefined) {
          this._newSub.searchForCompany(sender);
          this.subscriptions[sender] = this._newSub;
          this._newSub.clearData();
        }
      }
    }
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
