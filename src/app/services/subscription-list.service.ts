import { Injectable } from '@angular/core';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: "root",
})
/**
 * Generates and handles list of subscriptions found in emails
 * @class
 */
export class SubscriptionListService {
  private dataSrc: String = null; // Google Drive API will provide a way to access email zip file, for now treated as a url
  private subscriptions = []; //Array of Subscription Objects

  /**
   * Creates Subscripton List class
   * @constructor
   */
  constructor() {}

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
   * @param { String } sourceURL - source URL from which email data must be retrieved
   */
  setUploadSrc(sourceURL) {
    this.dataSrc = sourceURL;
  }

  /**
   * Scans emails found at source URL and adds subscriptions to subscription list
   */
  scanEmail () {
    // Will add Subscription objects to the subscription list
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
