import { Component, OnInit } from '@angular/core';
import { SubscriptionListService } from '../services/subscription-list.service';
import { PIPEDAListService } from '../services/pipedalist.service';

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.css"],
})
/**
 * Controls View of Dashboard Page Outer Frame and calls relevant functions
 * @class
 * @implements { OnInit }
 */
export class DashboardPageComponent implements OnInit {
  /**
   * Creates Subscription List and PIPEDA List class instances
   * @constructor
   */
  constructor(private _subscriptionList : SubscriptionListService, private _PIPEDAList: PIPEDAListService) {}

  /**
   * Loads any scripts needed for Dashboard Page
   */
  ngOnInit(): void {}

  /**
   * Assigns upload source link to subscription list and initiates scan
   * @param { String } sourceURL - Upload source (will involve Google Drive API, is a link for now)
   */
  uploadData(sourceURL: String) {
    this._subscriptionList.setUploadSrc(sourceURL);
    this.scanEmail();
  }

  /**
   * Checks whether email data has been uploaded
   * @returns { Boolean } Returns true if data has been uploaded, false if it hasn't
   */
  isEmailUploaded() {
    return this._subscriptionList.isDataUploaded();
  }

  /**
   * Adds a given subscription to the list of PIPEDA requests
   * @param { Number } id - Index of the particular subscription on sublist
   * @param { String } type - Is this a retrieval or deletion request?
   */
  addToPIPEDAList(id: Number, type: String) {
    this._PIPEDAList.add(this._subscriptionList.getSubscription(id), type)
  }

  /**
   * Initiates a mailto request using pipedalist object
   */
  sendMailTo() {
    this._PIPEDAList.send();
  }

  /**
   * Downloads PIPEDA template
   */
  downloadPIPEDATemplate() {
    this._subscriptionList.downloadTemplate();
  }

  /**
   * Downloads a text file of PIPEDA addresses
   */
  downloadAddresses() {
    this._PIPEDAList.downloadAddresses();
  }

  /**
   * Initiates scan for subscriptions
   */
  private scanEmail() {
    this._subscriptionList.scanEmail();
  }
}
