import { Injectable } from '@angular/core';
import { SubscriptionData } from './prototypes/subscription-data-interface';

@Injectable({
  providedIn: "root",
})
/**
 * Holds a list of subscriptions that are utilizing the PIPEDA automatic request feature
 * Initiates mailto request or downloads
 * @class
 */
export class PIPEDAListService {
  private retrievalList = [];
  private deletionList = [];

  /**
   * Creates PIPEDAListService class
   * @constructor
   */
  constructor() {}

  /**
   *
   * @param { SubscriptionData } subscription - the subscription being added to the PIPEDA list
   * @param { string } type - the type of request to be sent (retrieval or deletion)
   */
  add(subscription: SubscriptionData, type: string) {
    if (type == "retrieval") {
      this.retrievalList.push(subscription);
    } else {
      this.deletionList.push(subscription);
    }
  }

  /**
   * Sends PIPEDA requests using mailto:
   */
  send() {
    //Initiate HTTP request
  }
  /**
   * Downloads PIPEDA list addresses in current form as a .txt file
   */
  downloadAddresses() {
    //Initiate download
  }
}
