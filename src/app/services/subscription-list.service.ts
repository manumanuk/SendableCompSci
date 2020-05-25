import { Injectable } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { CredentialData } from './prototypes/credential-prototype'
import { PIPEDAListService } from './pipedalist.service';
import { SubscriptionData } from './prototypes/subscription-data-interface'
import { bubbleSort, selectionSort, linearSearch, binarySearch } from './prototypes/sorting-searching-algorithms'


@Injectable({
  providedIn: "root",
})

/**
 * Generates and handles list of subscriptions found in emails
 * @class
 */
export class SubscriptionListService {
  private dataSrc: string = null; // Google Drive API will provide a way to access email zip file, for now treated as a url
  private subscriptions:{[name:string]:SubscriptionData} = { }; //Array of SubscriptionData Objects attached to names
  private emailData: string = null;
  private emailPack: Array<string> = [];
  public googleAuth: gapi.auth2.GoogleAuth;
  private avoidAddresses: Array<String> = [
    "google.com",
    "gmail.com",
    "youtube.com",
    "hotmail.com",
    "yahoo.com",
    "yahoo.ca",
    "outlook.com",
    "docs.google.com",
    "youtube.com",
    "pdsb.net",
    "peelsb.com"
  ];

  /**
   * Creates Subscripton List class
   * @constructor
   * @param { SubscriptionService } _newSub - Handles generation of new SubscriptionData objects
   */
  constructor(private _newSub: SubscriptionService) {}

  /**
   * Performs various sorting and searching algorithms on ~5 MB of Email data, measures timings to complete.
   */
  /*
  sortAndSearchTest() {
    let emailWords = this.emailData.slice(0, 2800000).split(/\s+/);
    console.log(emailWords);

    let realIndex = emailWords.indexOf("From:");
    console.log("Here is what the real search returned: " + realIndex);

    let startTime = performance.now();
    let linearIndex = linearSearch(emailWords, "crazy");
    console.log("Here is what linearSearch returned: " + linearIndex);
    let endTime = performance.now();
    console.log("Linear Search performed in " + (endTime-startTime));

    startTime = performance.now();
    let realSorted = emailWords.sort();
    console.log("Here is the real sort: ");
    console.log(realSorted);
    endTime = performance.now();
    console.log("Built-in sort performed in " + (endTime - startTime));

    startTime = performance.now();
    let selectionSorted = selectionSort(emailWords);
    console.log("Here is selection sort: ");
    console.log(selectionSorted);
    if (selectionSorted == realSorted) {
      console.log("Selection sorted and real sorted arrays are identical.");
    }
    endTime = performance.now();
    console.log("Selection Sort performed in " + (endTime - startTime));

    startTime = performance.now();
    let bubbleSorted = bubbleSort(emailWords);
    console.log("Here is bubble sort: ");
    console.log(bubbleSorted);
    if (bubbleSorted == realSorted) {
      console.log("Bubble sorted and real sorted arrays are identical.");
    }
    endTime = performance.now();
    console.log("Bubble Sort performed in " + (endTime - startTime));

    startTime = performance.now();
    let binaryIndex = binarySearch(realSorted, "From:");
    console.log("Here is what binarySearch returned: " + binaryIndex);
    endTime = performance.now();
    console.log("Binary Search performed in " + (endTime - startTime));
  }
  */

  /**
   * Locates the fileId of emails
   * @param { CredentialData } token: Access token to invoke Drive API
   */
  searchForTestFile(token:CredentialData) {
    gapi.auth.setToken({access_token: token.credential.accessToken});
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
   * Sets fileId for email data, begins file scan by calling scanEmail();
   * @param { string } fileId: Google Drive API file ID to retrieve email data from
   */
  private setUploadSrc(fileId:string) {
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
  }


  /**
    * Checks if data resource has been uploaded
    * @returns { boolean } - Returns true if data source has been uploaded, else returns false
  */
  isDataUploaded() {
    let status: boolean;
    //Call external function to check whether an upload has occured
    if (this.dataSrc == null) {
      status = false;
    } else {
      status = true;
    }
    return status;
  }

  /**
   * Scans emails found at source URL and adds subscriptions to subscription list
   */
  private async scanEmail() {
    //Analyze emails: STRING MANIPULATION
    this.splitMail();

    //this.sortAndSearchTest();

    for (let email of this.emailPack) {
      let index = email.search("From: ");
      let serviceName: string = email
        .slice(
          index + "From: ".length,
          index + email.slice(index, index + 1000).search("\n")
        )
        .trim();

      if (serviceName.search(">") != -1) {
        let address: string = "";
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

        if (this.subscriptions == { } || (Object.keys(this.subscriptions).indexOf(name) == -1 && this.avoidAddresses.indexOf(address) == -1)) {
          await this._newSub.searchForCompany(name, address);
          let newSubData = new SubscriptionData;
          newSubData = JSON.parse(JSON.stringify(this._newSub.getData()));
          this._newSub.clearData();
          this.subscriptions[name] = newSubData;
        } else if (Object.keys(this.subscriptions).indexOf(name) != -1) {
          this.subscriptions[name].emailFrequency++;
        }
      }
    }

    console.log(this.subscriptions);

  }

  /**
   * Prints out list of subscriptions to console
   * @returns { Array<SubscriptionData> } - returns an array of all subscriptions
   */
  printSubscriptionData() {
    return Object.values(this.subscriptions);
  }

  /**
   * Splits given email data string into array of emails
   */
  private splitMail(): void {
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
   * @param { string } service - Name of target subscription
   * @returns { SubscriptionData } Returns a subscription object
   */
  getSubscription(service: string) {
    return this.subscriptions[service];
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
